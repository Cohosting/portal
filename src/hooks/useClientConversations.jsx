import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchConversationById } from "../services/chat";

const fetchConversations = async (portal_id, client_id) => {
    try {
        const { data, error } = await supabase
            .rpc('fetch_conversations_by_client', {
                _portal_id: portal_id,
                _client_id: client_id
            });

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const useClientConversations = (portal_id, client_id) => {

    const [conversations, setConversations] = useState([]);
    const [fetchedWay, setFetchedWay] = useState('initial');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const optimisticMarkLastMessageAsSeen = (conversation, userId) => {
        const updatedConversation = {
            ...conversation,
            last_message: {
                ...conversation?.last_message,
                seen: conversation?.last_message?.seen
                    ? [...conversation?.last_message?.seen, userId]
                    : [userId],
            },
        };

        setConversations(prev => {
            return prev.map(conv =>
                conv.id === updatedConversation.id ? updatedConversation : conv
            );
        });
    };

    useEffect(() => {
        if (!portal_id || !client_id) return;
        
        setIsLoading(true);

        fetchConversations(portal_id, client_id)
            .then(data => {
                setConversations(data || []);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });

        const conversationSubscription = supabase
            .channel(`conversations:${portal_id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'conversations',
                    filter: `portal_id=eq.${portal_id}`,
                },
                async payload => {
                    let newConversation = payload.new;
                    
                    try {
                        const conv = await fetchConversationById(newConversation.id);
                        
                        if (conv && conv.participants && 
                            conv.participants.some(participant => 
                                participant && participant.participant_id === client_id
                            )) {
                            setConversations(prev => [conv, ...prev]);
                        }
                    } catch (error) {
                        console.error('Error fetching new conversation:', error);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'conversations',
                    filter: `portal_id=eq.${portal_id}`,
                },
                async payload => {
                    let updatedConversation = payload.new;
                    
                    try {
                        const data = await fetchConversationById(updatedConversation.id);
                        setConversations(prev => 
                            prev.map(conversation => 
                                conversation.id === payload.new.id ? data : conversation
                            )
                        );
                    } catch (error) {
                        console.error('Error fetching updated conversation:', error);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'conversations',
                    filter: `portal_id=eq.${portal_id}`,
                },
                async payload => {
                    setConversations(prev => 
                        prev.filter(conversation => conversation.id !== payload.old.id)
                    );
                    setFetchedWay('DELETE');
                }
            )
            .subscribe();

        return () => { 
            conversationSubscription.unsubscribe();
        }
    }, [portal_id, client_id])

    return {
        conversations: conversations.filter((conv) =>
            conv !== null &&
            conv.status !== 'deleted' &&
            conv.participants &&
            Array.isArray(conv.participants) &&
            conv.participants.some(participant => 
                participant && 
                participant.participant_type === 'clients' && 
                participant.participant_id === client_id
            )
        ), 
        optimisticMarkLastMessageAsSeen, 
        fetchedWay, 
        isLoading, 
        error
    }
}
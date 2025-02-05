import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchConversationById } from "../services/chat";


const fetchConversations = async (portal_id, client_id) => {
    try {
        const { data } = await supabase
            .from('conversations')
            .select(`
    *,
    participants:users!inner(id, name, avatar_url),
    last_message:last_message_id(id, content, seen, created_at),
    conversation_participants!inner(user_id)
  `)
            .eq('conversation_participants.user_id', client_id)
            .eq('portal_id', portal_id)
            .order('updated_at', { ascending: false });

        return data 
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
        console.log({
            portal_id,
            client_id
        })
        setIsLoading(true);

        fetchConversations(portal_id, client_id).then(data => {
            setConversations(data);
            setIsLoading(false);
        }).catch(error => {
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
                    // setData(prev => ({
                    //     conversations: [payload.new, ...prev.conversations],
                    //     fetchedWay: 'INSERT',
                    // }));
                    // need to fetch data cause payload dont have embed data
                    console.log(`Conversation ${payload.new.id} inserted`);
                    let newConversation = payload.new;
                    const conv = await fetchConversationById(newConversation.id, client_id)
                    console.log({
                        conv
                    })
                    setConversations(prev => [conv, ...prev]);



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
                    console.log(`Conversation ${payload.new.id} updated`);
                    let updatedConversation = payload.new;
                    fetchConversationById(updatedConversation.id, client_id).then(data => {
                        setConversations(prev => prev.map(conversation => conversation.id === payload.new.id ? data : conversation));
                    }
                    );
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

                    setConversations(prev => prev.filter(conversation => conversation.id !== payload.old.id));
                    setFetchedWay('DELETE');
                }
            )
            .subscribe();

        return () => { conversationSubscription.unsubscribe() }
    }, [portal_id, client_id])

    console.log({
        beforeDelete: conversations
    })

    return {
        conversations: conversations.filter((conv) =>
            conv !== null &&
            conv.status !== 'deleted' &&
            conv.participants &&
            Array.isArray(conv.participants) &&
            conv.participants.some(participant => participant && participant.id === client_id)
        ), optimisticMarkLastMessageAsSeen, fetchedWay, isLoading, error
    }

}
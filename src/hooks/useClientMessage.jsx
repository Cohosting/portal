import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";


const fetchInitialMessages = async (conversationId) => {
    // supabase

    const { data, error } = await supabase
        .from('messages')
        .select('*, sender:sender_id (id, name, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }


    return data;

};

export const useClientMessage = (conversationId) => {

    const [messages, setMessages] = useState([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!conversationId) return;

        setIsMessagesLoading(true);
        fetchInitialMessages(conversationId)
            .then((data) => {
                setMessages(data);
            })
            .catch((error) => {
                setIsError(true);
            })
            .finally(() => {
                setIsMessagesLoading(false);
            });

        const messageSubscription = supabase.channel(`messages:${conversationId}`).on('INSERT', (payload) => {
            setMessages(prev => [...prev, payload.new]);

        }).on('UPDATE', (payload) => {
            setMessages(prev => prev.map(message => message.id === payload.new.id ? payload.new : message));
        }).on('DELETE', (payload) => {
            setMessages(prev => prev.filter(message => message.id !== payload.old.id));
        }).subscribe();

        return () => {
            messageSubscription.unsubscribe();
        }
    }, [conversationId]);


    return {
        messages,
        isMessagesLoading,
        isError
    }




}



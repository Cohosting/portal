import { useQuery } from 'react-query';
import { fetchConversations, fetchMessages } from '../../services/chat';
import { queryKeys } from './queryKeys';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

export const useChatConversations = portal_id => {
  return useQuery(
    queryKeys.conversations(portal_id),
    () => fetchConversations(portal_id),
    {
      enabled: !!portal_id,
    }
  );
};

export const useRealtimeMessages = conversationId => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessagesFromSupabase = async () => {
      try {
        const messages = await fetchMessages(conversationId);
        setMessages(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(error);
      }
    };

    fetchMessagesFromSupabase();

    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        payload => {
          fetchMessagesFromSupabase(); // Refetch all messages
          // For a more efficient approach, you could update the state based on the payload
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  return { error, messages, setMessages };
};

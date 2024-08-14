import {
  fetchInitialMessages,
  fetchMoreMessages,
  fetchSender,
  handleRealtimePayload,
  markAsSeen,
} from '../../services/chat';
import { supabase } from '../../lib/supabase';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const fetchConversationById = async conversationId => {
  const { data, error } = await supabase
    .from('conversations')
    .select(
      `
      id,
      name,
      created_at,
      updated_at,
      participants:users!inner(id, name, avatar_url),
      last_message:last_message_id(id, content, seen, created_at)
    `
    )
    .eq('id', conversationId)
    .single();

  if (error) {
    console.error('Error fetching conversation:', error);
    return null;
  }

  return data;
};

export const useChatConversations = portal_id => {
  const [conversations, setConversations] = useState([]);
  const [fetchedWay, setFetchedWay] = useState('initial');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const optimisticMarkLastMessageAsSeen = (conversation, userId) => {
    const updatedConversation = {
      ...conversation,
      last_message: {
        ...conversation.last_message,
        seen: conversation.last_message.seen
          ? [...conversation.last_message.seen, userId]
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
    if (!portal_id) return;

    const fetchInitialConversations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(
            `
            id,
            name,
            created_at,
            updated_at,
            participants:users!inner(id, name, avatar_url),
            last_message:last_message_id(id, content, seen, created_at )
          `
          )
          .eq('portal_id', portal_id)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        setConversations(data);
        setFetchedWay('initial');
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialConversations();

    const subscription = supabase
      .channel(`conversations:${portal_id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversations',
          filter: `portal_id=eq.${portal_id}`,
        },
        payload => {
          setConversations(prev => [payload.new, ...prev]);
          setFetchedWay('INSERT');
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
          console.log('it is updated');
          const updatedConversation = await fetchConversationById(
            payload.new.id
          );
          console.log(`Updated conversation:`, updatedConversation);
          if (updatedConversation) {
            setConversations(prev => {
              return prev.map(conv =>
                conv.id === updatedConversation.id ? updatedConversation : conv
              );
            });
            setFetchedWay('UPDATE');
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
        payload => {
          setConversations(prev => {
            return prev.filter(conv => conv.id !== payload.old.id);
          });
          setFetchedWay('DELETE');
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [portal_id]);

  return {
    error,
    isLoading: loading,
    conversations,
    fetchedWay,
    optimisticMarkLastMessageAsSeen,
    updatedConversation: setConversations,
  };
};
export const useRealtimeMessages = (
  conversationId,
  initialLimit = 15,
  conversations,
  user
) => {
  const [messages, setMessages] = useState([]);
  const fetchedWay = useRef('INITIAL');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const initializeMessages = async () => {
    setLoading(true);
    try {
      const { data, hasMore } = await fetchInitialMessages(
        conversationId,
        initialLimit
      );
      fetchedWay.current = 'INITIAL';
      setMessages(data);

      setHasMore(hasMore);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!conversationId || !user) return;

    console.log('first-fetched');
    initializeMessages();

    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        payload => {
          // let currentConversation = conversations.find(
          //   conv => conv.id === conversationId
          // );
          // const message = payload.new;
          // // check if conversations last message id mathc
          // if (
          //   currentConversation.last_message &&
          //   currentConversation.last_message.id === message.id
          // ) {
          //   console.log(
          //     `Message ${message.id} is the last message in conversation ${conversationId}`
          //   );
          // }
          // Handle UPDATE event
          // handleRealtimePayload(payload, setMessages, fetchSender);
          // fetchedWay.current = 'UPDATE';
          // markAsSeen(currentConversation, user.id);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        payload => {
          console.log(
            `New message in conversation ${conversationId} user id: ${user.id}`
          );
          let conversation = {
            last_message: {
              id: payload.new.id,
            },
          };

          handleRealtimePayload(payload, setMessages, fetchSender);
          fetchedWay.current = 'INSERT';
          // markAsSeen(conversation, user.id);
        }
      )
      .subscribe(status => {
        console.log('Subscription status:', status);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, initialLimit, user]);

  const loadMoreMessages = (listRef, fetchedWay) => {
    setMoreLoading(true);
    fetchMoreMessages(
      conversationId,
      initialLimit,
      messages,
      listRef,
      setMessages,
      setHasMore,
      setError,
      fetchedWay
    ).finally(() => {
      setMoreLoading(false);
    });
  };

  return {
    error,
    moreLoading,
    messages,
    setMessages,
    fetchMoreMessages: loadMoreMessages,
    isLoading: loading,
    hasMore,
    fetchedWay,
  };
};

// src/hooks/react-query/useChat.js
import {
  fetchInitialMessages,
  fetchMoreMessages, // Import from your services
  fetchSender,
  handleRealtimePayload,
  markAsSeen,
} from '../../services/chat';
import { supabase } from '../../lib/supabase';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// ——— Helper to fetch one convo by ID via RPC ———
const fetchConversationById = async (conversationId, portalId) => {
  const { data, error } = await supabase.rpc(
    'fetch_conversations_with_participants',
    { _portal_id: portalId }
  );
  if (error) {
    console.error('Error fetching conversation by ID:', error);
    return null;
  }
  // data is an array → pick the one with matching ID
  return (data || []).find(c => c.id === conversationId) || null;
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
        ...conversation?.last_message,
        seen: conversation?.last_message?.seen
          ? [...conversation.last_message.seen, userId]
          : [userId],
      },
    };
    setConversations(prev =>
      prev.map(conv => (conv.id === updatedConversation.id ? updatedConversation : conv))
    );
  };

  useEffect(() => {
    if (!portal_id) return;

    const fetchInitialConversations = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc(
          'fetch_conversations_with_participants',
          { _portal_id: portal_id }
        );
        if (error) throw error;
        const cleaned = (data || []).filter(c => c != null);
        setConversations(cleaned);
        setFetchedWay('initial');
      } catch (err) {
        setError(err);
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
        async payload => {
          const newConv = await fetchConversationById(payload.new.id, portal_id);
          if (newConv) {
            setConversations(prev => [newConv, ...prev]);
            setFetchedWay('INSERT');
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
          const updatedConv = await fetchConversationById(payload.new.id, portal_id);
          if (updatedConv) {
            setConversations(prev =>
              prev.map(conv => (conv.id === updatedConv.id ? updatedConv : conv))
            );
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
          setConversations(prev => prev.filter(conv => conv.id !== payload.old.id));
          setFetchedWay('DELETE');
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [portal_id]);

  const refetchConversations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc(
        'fetch_conversations_with_participants',
        { _portal_id: portal_id }
      );
      if (error) throw error;
      setConversations((data || []).filter(c => c != null));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    isLoading: loading,
    conversations: conversations.filter(c => c?.status !== 'deleted'),
    fetchedWay,
    optimisticMarkLastMessageAsSeen,
    updatedConversation: setConversations,
    refetchConversations,
  };
};

export const useRealtimeMessages = (
  conversationId,
  initialLimit = 15,
  conversations,
  user,
  listRef
) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [error, setError] = useState(null);

  // tracks how the last update came in
  const fetchedWay = useRef('INITIAL');
  // ensure we only fetch initial page once per conversation
  const initRef = useRef(false);
  // we only care if the user ID changes
  const userId = user?.id;

  const initializeMessages = async () => {
    if (initRef.current) return;
    setLoading(true);
    try {
      const { data, hasMore: moreFlag } = await fetchInitialMessages(
        conversationId,
        initialLimit
      );
      fetchedWay.current = 'INITIAL';
      setMessages(data);
      setHasMore(moreFlag);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      initRef.current = true;
    }
  };

  useEffect(() => {
    if (!conversationId || !userId) return;

    initializeMessages();

    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        payload => {
          handleRealtimePayload(payload, setMessages, fetchSender);
          fetchedWay.current = 'INSERT';
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        payload => {
          handleRealtimePayload(
            payload,
            setMessages,
            fetchSender,
            messages
          );
          fetchedWay.current = 'UPDATE';
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        payload => {
          setMessages(prev => prev.filter(m => m.id !== payload.old.id));
          fetchedWay.current = 'DELETE';
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      // reset so if the conversationId changes we re-init
      initRef.current = false;
      setMessages([]);
      setHasMore(false);
    };
  }, [conversationId, initialLimit, userId]);

  const loadMoreMessages = (listRef) => {
    setMoreLoading(true);
    fetchMoreMessages(
      conversationId,
      initialLimit,
      messages,
      listRef,
      setMessages,
      setHasMore,
      setError,
      fetchedWay // Pass the ref here
    ).finally(() => setMoreLoading(false));
  };

  // Handle scroll position restoration after messages are updated
  useEffect(() => {
    console.log('🔄 Messages changed, checking fetchedWay:', fetchedWay.current);
    
    if (fetchedWay.current?.type === 'LOAD_MORE' && listRef?.current) {
      const scrollContainer = listRef.current;
      const { oldScrollHeight, oldScrollTop } = fetchedWay.current;
      
      const adjustScroll = () => {
        const newScrollHeight = scrollContainer.scrollHeight;
        const heightDifference = newScrollHeight - oldScrollHeight;
        const calculatedScrollTop = oldScrollTop + heightDifference;
        
        console.log('📏 SCROLL ADJUSTMENT (useEffect):', {
          newScrollHeight,
          oldScrollHeight,
          heightDifference,
          calculatedScrollTop,
          beforeAdjustment: scrollContainer.scrollTop
        });
        
        if (heightDifference > 0) {
          scrollContainer.scrollTop = calculatedScrollTop;
          
          console.log('✅ AFTER ADJUSTMENT (useEffect):', {
            finalScrollTop: scrollContainer.scrollTop
          });
        } else {
          console.log('⚠️ No height difference in useEffect');
        }
      };
  
      // Try multiple timings to catch when DOM is updated
      adjustScroll(); // Immediate
      requestAnimationFrame(adjustScroll);
      setTimeout(adjustScroll, 0);
      setTimeout(adjustScroll, 10);
      
      // Reset the fetchedWay flag
      fetchedWay.current = null;
    }
  }, [messages, listRef]);

  return {
    messages,
    isLoading: loading,
    hasMore,
    moreLoading,
    fetchedWay: fetchedWay,
    error,
    fetchMoreMessages: loadMoreMessages,
    setMessages,
  };
};
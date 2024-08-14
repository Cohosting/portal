import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Adjust the import path as needed

export const useMessageSeen = (conversationId, userId) => {
  const [lastSeenMessageId, setLastSeenMessageId] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0);

  const updateLastSeen = useCallback(async (messageId) => {
    console.log({
      conversationId,
      userId,
      messageId,
    })
    if (!messageId || !conversationId || !userId) return;


    try {
      const { data, error } = await supabase.rpc('update_last_seen', {
        p_conversation_id: conversationId,
        p_user_id: userId,
        p_message_id: messageId,
        p_client_counter: updateCounter
      });

      if (error) throw error;

      setLastSeenMessageId(messageId);
      setUpdateCounter(prev => prev + 1);
    } catch (error) {
      console.error('Error updating last seen:', error);
      await refreshConversationState();
    }
  }, [conversationId, userId, updateCounter]);

  const refreshConversationState = useCallback(async () => {
    if (!conversationId || !userId) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('last_seen_by, update_counter')
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      data.last_seen_by && data.last_seen_by[userId] && setLastSeenMessageId(data?.last_seen_by[userId]);
      setUpdateCounter(data.update_counter);
    } catch (error) {
      console.error('Error refreshing conversation state:', error);
    }
  }, [conversationId, userId]);

  useEffect(() => {
    refreshConversationState();
  }, [refreshConversationState]);



  return {
    lastSeenMessageId,
    updateLastSeen,
    refreshConversationState
  };
};

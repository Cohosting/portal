import { useEffect, useRef } from 'react';
import { markAsSeen } from '../../services/chat';

export const useMarkConversationAsSeen = (
  messages,
  conversations,
  conversationId,
  userId
) => {
  const hasMarkedAsSeenRef = useRef(false);

  useEffect(() => {
    if (messages.length > 0 && !hasMarkedAsSeenRef.current) {
      let currentConversation = conversations.find(
        conv => conv.id === conversationId
      );
      if (currentConversation) {
        markAsSeen(currentConversation, userId).then(() => {
          hasMarkedAsSeenRef.current = true;
        });
      }
    }
  }, [messages, conversations, conversationId, userId, markAsSeen]);
};

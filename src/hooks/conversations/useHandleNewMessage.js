import { useEffect } from 'react';
import { markAsSeen } from '../../services/chat';

export const useHandleNewMessage = (
  messages,
  conversationId,
  conversations,
  fetchedWay,
  lastElementVisible,
  setIsFloatingAlertVisible,
  userId
) => {
  console.log(fetchedWay?.current)
  useEffect(() => {
    if (messages.length > 0 && fetchedWay?.current === 'INSERT') {
      if (lastElementVisible?.current) {
        const currentConversation = conversations?.find(
          conv => conv.id === conversationId
        );

        markAsSeen(currentConversation, userId).then(() =>
          console.log('Marked as seen')
        );
      } else {
        let lastMessage = messages[messages.length - 1];
        if (lastMessage.sender_id !== userId) {
          setIsFloatingAlertVisible(true);
        }
      }
    }
  }, [
    messages,
    conversationId,
    conversations,
    fetchedWay,
    lastElementVisible,
    setIsFloatingAlertVisible,
    userId,
  ]);
};

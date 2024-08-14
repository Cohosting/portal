import { useEffect, useRef } from 'react';

export const useScrollToEndOnMessageChange = (
  messages,
  messagesEndRef,
  lastElementVisible
) => {
  const onMount = useRef(true);

  useEffect(() => {
    if (!messages.length) return;

    if (messagesEndRef.current) {
      if (lastElementVisible.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
      } else if (onMount.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
        onMount.current = false;
      }
    }
  }, [messages, messagesEndRef, lastElementVisible]);
};

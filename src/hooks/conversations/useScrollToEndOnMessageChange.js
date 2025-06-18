import { useEffect, useRef } from 'react';

export const useScrollToEndOnMessageChange = (
  messages,
  messagesEndRef,
  lastElementVisible
) => {
  const onMount = useRef(true);

  useEffect(() => {
    if (!messages.length) return;
    console.log('Scroll to end', messages.length, lastElementVisible.current, messagesEndRef.current);

    if (messagesEndRef.current) {
      console.log('Scroll to end', messages.length, lastElementVisible.current);
      if (lastElementVisible.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (onMount.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        onMount.current = false;
      }
    }
  }, [messages, messagesEndRef, lastElementVisible]);
};

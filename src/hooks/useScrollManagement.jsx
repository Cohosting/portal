import { useState, useEffect, useRef, useCallback } from 'react';

export const useScrollManagement = () => {
  const scrollRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current && shouldScrollToBottom) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [shouldScrollToBottom]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setShouldScrollToBottom(scrollTop + clientHeight >= scrollHeight - 10);
      }
    };

    scrollRef.current?.addEventListener('scroll', handleScroll);
    return () => scrollRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  const maintainScrollPosition = useCallback((action) => {
    if (scrollRef.current) {
      const prevScrollHeight = scrollRef.current.scrollHeight;
      const prevScrollTop = scrollRef.current.scrollTop;

      return action().then(() => {
        if (scrollRef.current) {
          const newScrollHeight = scrollRef.current.scrollHeight;
          const newScrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
          scrollRef.current.scrollTop = newScrollTop;
        }
      });
    }
    return Promise.resolve();
  }, []);

  return {
    scrollRef,
    shouldScrollToBottom,
    scrollToBottom,
    maintainScrollPosition,
    setShouldScrollToBottom
  };
};
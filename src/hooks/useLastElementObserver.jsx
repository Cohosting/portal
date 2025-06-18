import { useRef, useEffect, useCallback, useState, useMemo } from 'react';

export const useLastElementObserver = (callback, options = {}) => {
  const observer = useRef(null);
  const lastElementRef = useRef(null);
  const callbackRef = useRef(callback); // Store callback in ref
  const [isVisible, setIsVisible] = useState(false);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const memoizedOptions = useMemo(() => ({
    root: options.root || null,
    rootMargin: options.rootMargin || '0px',
    threshold: options.threshold || 0
  }), [options.root, options.rootMargin, options.threshold]);

  const observeLastElement = useCallback((node) => {
    console.log('[useLastElementObserver] observeLastElement called with node:', node);

    if (observer.current) {
      console.log('[useLastElementObserver] disconnecting previous observer');
      observer.current.disconnect();
    }

    if (node) {
      observer.current = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const visible = entry.isIntersecting;
          setIsVisible(visible);

          // Use callbackRef.current instead of memoizedCallback
          if (visible) {
            console.log('[useLastElementObserver] ➡️ Last element is in view');
            callbackRef.current(true);
          } else {
            console.log('[useLastElementObserver] ⬅️ Last element is out of view');
            callbackRef.current(false);
          }
        });
      }, memoizedOptions);

      observer.current.observe(node);
      lastElementRef.current = node;
    } else {
      setIsVisible(false);
    }
  }, [memoizedOptions]); // Remove memoizedCallback dependency

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { observeLastElement, isVisible };
};
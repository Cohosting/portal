import { useRef, useEffect, useCallback } from 'react';

export const useLastElementObserver = (callback, options = {}) => {
  const observer = useRef(null);
  const lastElementRef = useRef(null);

  const observeLastElement = useCallback((node) => {
    if (observer.current) observer.current.disconnect(); // Disconnect previous observer

    if (node) {
      observer.current = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(true); // Last element is in view
          } else {
            callback(false); // Last element is not in view
          }
        });
      }, options);

      observer.current.observe(node); // Observe the new last element
      lastElementRef.current = node;
    }
  }, [callback, options]);

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect(); // Cleanup on unmount
    };
  }, []);

  return observeLastElement;
};
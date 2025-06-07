
  // Custom hook for keyboard navigation
  export const useKeyboardNavigation = (suggestions, highlightedIndex, setHighlightedIndex, onSelect) => {
    const handleKeyDown = (e) => {
      if (!suggestions.length) return;
  
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            onSelect(suggestions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setHighlightedIndex(-1);
          break;
      }
    };
  
    return { handleKeyDown };
  };
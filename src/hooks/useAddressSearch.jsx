
import { useState, useEffect } from 'react';
import mapboxGeocodingAPI from '@/utils/mapboxGeocodingAPI';



// Custom hook for address search
export const useAddressSearch = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
    useEffect(() => {
      const searchAddresses = async () => {
        if (query.length < 2) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }
  
        setIsLoading(true);
        try {
          const results = await mapboxGeocodingAPI.search(query);
          setSuggestions(results);
          setShowSuggestions(true);
          setHighlightedIndex(-1);
        } catch (error) {
          console.error('Address search failed:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      };
  
      const debounceTimer = setTimeout(searchAddresses, 300);
      return () => clearTimeout(debounceTimer);
    }, [query]);
  
    const clearSearch = () => {
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    };
  
    return {
      query,
      setQuery,
      suggestions,
      isLoading,
      showSuggestions,
      setShowSuggestions,
      highlightedIndex,
      setHighlightedIndex,
      clearSearch
    };
  };
  
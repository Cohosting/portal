import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useQueryClient } from 'react-query';

export const useDomainInfo = (shouldCheckDomain = false) => {
  const [domain, setDomain] = useState({ 
    name: null, 
    type: null, 
    existsInDb: false, 
    portalData: null 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const abortControllerRef = useRef(null);

  const isBrowser = typeof window !== 'undefined';

  const checkDomainInDatabase = useCallback(async (domainName) => {
    setIsLoading(true);
    setError(null);

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      const { data, error } = await supabase
        .from('portals')
        .select('* , portal_apps(*)')
        .eq('portal_url', domainName)
        .limit(1);

      if (error) throw error;

      // Check if request was aborted
      if (signal.aborted) return;

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate a delay
      
      // Check again after delay
      if (signal.aborted) return;

      if (data.length > 0) {
        const portalData = data[0];
        setDomain(prevState => ({ 
          ...prevState, 
          existsInDb: true, 
          portalData 
        }));
        queryClient.setQueryData(['portalData', domainName], portalData);
      } else {
        setDomain(prevState => ({ 
          ...prevState, 
          existsInDb: false, 
          portalData: null 
        }));
        // Clear cache for this domain
        queryClient.removeQueries(['portalData', domainName]);
      }
    } catch (err) {
      // Don't set error if request was aborted
      if (!signal.aborted) {
        setError(err.message);
        setDomain(prevState => ({ 
          ...prevState, 
          existsInDb: false, 
          portalData: null 
        }));
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [queryClient]);

  useEffect(() => {
    if (!isBrowser) return;

    const host = window.location.host;
    
    // Remove port number if present
    const hostWithoutPort = host.split(':')[0];

    if (hostWithoutPort.includes('.huehq.com')) {
      const arr = hostWithoutPort.split('.').slice(0, -2);
      if (arr.length > 0 && arr[0] !== 'www') {
        setDomain(prevState => ({ 
          ...prevState, 
          name: arr[0], 
          type: 'subdomain' 
        }));
      }
    } else if (host.includes('localhost')) {
      // Keep using 'host' here to maintain compatibility with current setup
      const arr = host.split('.').slice(0, -1);
      if (arr.length > 0 && arr[0] !== 'www') {
        setDomain(prevState => ({ 
          ...prevState, 
          name: arr[0], 
          type: 'subdomain' 
        }));
      } else {
        setDomain(prevState => ({ 
          ...prevState, 
          name: 'localhost', 
          type: 'localhost' 
        }));
      }
    } else {
      setDomain(prevState => ({ 
        ...prevState, 
        name: hostWithoutPort, // Use hostWithoutPort for custom domains
        type: 'customDomain' 
      }));
    }
  }, [isBrowser]);

  useEffect(() => {
    if (shouldCheckDomain && domain.name) {
      checkDomainInDatabase(domain.name);
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [shouldCheckDomain, domain.name, checkDomainInDatabase]);

  return {
    domain,
    isLoading,
    error,
  };
};
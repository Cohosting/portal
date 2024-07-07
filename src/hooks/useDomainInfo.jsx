import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useQueryClient } from 'react-query';

export const useDomainInfo = (shouldCheckDomain = false) => {
  const [domain, setDomain] = useState({ name: null, type: null, existsInDb: false, portalData: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const isBrowser = typeof window !== 'undefined';

  const checkDomainInDatabase = useCallback(async (domainName) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('portals')
        .select('* , portal_apps(*)')
        .eq('portal_url', domainName)
        .limit(1);

      if (error) throw error;

      if (data.length > 0) {
        const portalData = data[0];
        setDomain(prevState => ({ ...prevState, existsInDb: true, portalData }));
        queryClient.setQueryData(['portalData', domainName], portalData);  // Set data in react-query cache
      } else {
        setDomain(prevState => ({ ...prevState, existsInDb: false, portalData: null }));
      }
    } catch (err) {
      setError(err.message);
      setDomain(prevState => ({ ...prevState, existsInDb: false, portalData: null }));
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  useEffect(() => {
    if (!isBrowser) return;

    const host = window.location.host;

    if (host.includes('.huehq.com')) {
      const arr = host.split('.').slice(0, -2);
      if (arr.length > 0 && arr[0] !== 'www') {
        setDomain({ name: arr[0], type: 'subdomain' });
      }
    } else if (host.includes('localhost')) {
      const arr = host.split('.').slice(0, -1);
      if (arr.length > 0 && arr[0] !== 'www') {
        setDomain({ name: arr[0], type: 'subdomain' });
      } else {
        setDomain({ name: 'localhost', type: 'localhost' });
      }
    } else {
      setDomain({ name: host, type: 'customDomain' });
    }
  }, [isBrowser]);

  useEffect(() => {
    if (shouldCheckDomain && domain.name) {
      checkDomainInDatabase(domain.name);
    }
  }, [shouldCheckDomain, domain.name, checkDomainInDatabase]);

  return {
    domain,
    isLoading,
    error,
  };
};

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchPortalDataByIdOrUrl } from '@/services/portalServices';

export const usePortalRealtimeData = (portal_id, options = {}) => {
  const [portalData, setPortalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    enabled = true,
    onUpdate = null, // Callback for when data updates
    ...otherOptions
  } = options;

  // Manual refresh function
  const refreshPortalData = async () => {
    if (!portal_id || !enabled) return;
    
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const data = await fetchPortalDataByIdOrUrl(portal_id);
      setPortalData(data);
      return data;
    } catch (err) {
      console.error('Error fetching portal data:', err);
      setIsError(true);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!portal_id || !enabled) return;

    // Initial data fetch
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    fetchPortalDataByIdOrUrl(portal_id)
      .then((data) => {
        setPortalData(data);
        if (onUpdate) onUpdate(data);
      })
      .catch((err) => {
        console.error('Error fetching initial portal data:', err);
        setIsError(true);
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Set up realtime subscription
    const subscription = supabase
      .channel(`portal_${portal_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portals',
          filter: `id=eq.${portal_id}`,
        },
        (payload) => {
          console.log('Portal data changed:', payload);
          
          // Handle different event types
          switch (payload.eventType) {
            case 'UPDATE':
              setPortalData(prev => {
                if (!prev) return payload.new;
                const updated = { ...prev, ...payload.new };
                if (onUpdate) onUpdate(updated);
                return updated;
              });
              break;
              
            case 'INSERT':
              setPortalData(payload.new);
              if (onUpdate) onUpdate(payload.new);
              break;
              
            case 'DELETE':
              setPortalData(null);
              if (onUpdate) onUpdate(null);
              break;
              
            default:
              // Fallback for any other event types
              setPortalData(prev => {
                if (!prev) return payload.new || payload.old;
                const updated = { ...prev, ...(payload.new || payload.old) };
                if (onUpdate) onUpdate(updated);
                return updated;
              });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [portal_id, enabled, onUpdate]);

  return {
    data: portalData,
    portalData, // Alias for backwards compatibility
    isLoading,
    isError,
    error,
    refreshPortalData,
    refetch: refreshPortalData, // Alias for React Query compatibility
    isRealtime: true,
  };
};
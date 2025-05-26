import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const useRealtimeSubscription = portalId => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*, portal:portal_id(created_by)')
          .eq('portal_id', portalId)
          .single();

        if (error) throw error;
        setSubscription(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Set up real-time subscription
    const channel = supabase
      .channel(`public:subscriptions:portal_id=eq.${portalId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `portal_id=eq.${portalId}`,
        },
        payload => {
          console.log('Received payload:', payload);

          switch (payload.eventType) {
            case 'INSERT':
            case 'UPDATE':
              console.log('Insert or Update:', payload.new);
              setSubscription(payload.new);
              break;
            case 'DELETE':
              console.log('Delete:', payload.old);
              setSubscription(null); // or handle deletion as needed
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      channel.unsubscribe();
    };
  }, [portalId]);

  return { subscription, loading: !subscription && loading, error };
};

export default useRealtimeSubscription;

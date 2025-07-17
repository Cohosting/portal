import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useRealtimePortalClients = (user, portal) => {
    const [clients, setClients] = useState([]);
    useEffect(() => {
        if (!user || !portal) return;

        // Initial fetch
        const fetchClients = async () => {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('is_deleted', false)
                .eq('portal_id', portal.id);

            if (error) {
                console.error('Error fetching clients:', error);
            } else {
                setClients(data);
            }
        };

        fetchClients();

        // Set up real-time subscription
        const subscription = supabase
            .channel(`clients:${portal.id}`)
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'clients',
                    filter: `portal_id=eq.${portal.id}`
                },
                (payload) => {
                    // Handle the change
                    fetchClients(); // Refetch all data
                    // Alternatively, you could update the state based on the payload
                    // This would be more efficient but requires more complex state management
                }
            )
            .subscribe();

        // Cleanup function
        return () => {
            subscription.unsubscribe();
        };
    }, [user, portal]);

    return clients;
};
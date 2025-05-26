import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const fetchAllAvailableSeats = async portalId => {
  const { data, error } = await supabase
    .from('seats')
    .select('*')
    .eq('portal_id', portalId);
  // .eq('status', 'available');

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const useRealtimeSeats = portalId => {
  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!portalId) return;
    const loadSeats = async () => {
      try {
        const data = await fetchAllAvailableSeats(portalId);
        setSeats(data);
      } catch (error) {
        console.error('Error fetching seats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSeats();

    const seatsSubscription = supabase
      .channel(`public:seats:portal_id=eq.${portalId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'seats',
          filter: `portal_id=eq.${portalId}`,
        },
        payload => {
          console.log('Received payload:', payload);

          switch (payload.eventType) {
            case 'INSERT':
              console.log('Insert:', payload.new);
              setSeats(prevSeats => [...prevSeats, payload.new]);
              break;
            case 'UPDATE':
              console.log('Update:', payload.new);
              setSeats(prevSeats => {
                const index = prevSeats.findIndex(
                  seat => seat.id === payload.new.id
                );
                if (index !== -1) {
                  // If the seat is already in the list, update it
                  const updatedSeats = [...prevSeats];
                  updatedSeats[index] = payload.new;
                  return updatedSeats;
                } else {
                  // If the seat is not in the list (became available), add it
                  return [...prevSeats, payload.new];
                }
              });
              break;
            case 'DELETE':
              console.log('Delete:', payload.old);
              setSeats(prevSeats =>
                prevSeats.filter(seat => seat.id !== payload.old.id)
              );
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    return () => {
      seatsSubscription.unsubscribe();
    };
  }, [portalId]);

  console.log({
    seats,
  });

  return {
    seats: seats.filter(seat => seat.status === 'available'),
    isSeatLoading: isLoading,
  };
};

export default useRealtimeSeats;

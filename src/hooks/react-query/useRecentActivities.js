import { useQuery } from 'react-query';
import { queryKeys } from './queryKeys';
import { supabase } from '../../lib/supabase';

export const getRecentActivities = async portal_id => {
  const { data, error } = await supabase
    .from('recent_activities')
    .select('*')
    .eq('portal_id', portal_id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
};

const useRecentActivities = portal_id => {
  return useQuery({
    queryKey: queryKeys.recentActivities(portal_id),
    queryFn: () => getRecentActivities(portal_id),
    enabled: !!portal_id,
  });
};

export default useRecentActivities;

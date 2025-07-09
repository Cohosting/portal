import { useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import { queryKeys } from './queryKeys';

const fetchTeamMembers = async (portalId, options = {}) => {
  let query = supabase
    .from('team_members')
    .select('*, user: user_id(name,avatar_url,email)')
    .eq('portal_id', portalId);

  if (options.status != null) {
    query = query.eq('status', options.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};


export const useTeamMembers = (portalId, options = {}) => {
  return useQuery(
    queryKeys.teamMembers(portalId),
    () => fetchTeamMembers(portalId, options),
    {
      enabled: !!portalId,
    }
  );
};

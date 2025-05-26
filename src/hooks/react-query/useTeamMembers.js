import { useQuery } from 'react-query';
import { supabase } from '../../lib/supabase';
import { queryKeys } from './queryKeys';

const fetchTeamMembers = async portalId => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*, user: user_id(name,avatar_url,email)')
    .eq('portal_id', portalId);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useTeamMembers = portalId => {
  return useQuery(
    queryKeys.teamMembers(portalId),
    () => fetchTeamMembers(portalId),
    {
      enabled: !!portalId,
    }
  );
};

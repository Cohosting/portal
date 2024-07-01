import { useQuery } from 'react-query';
import { queryKeys } from './queryKeys';
import {
  fetchPortalData,
  fetchTeamMemberData,
} from '../../services/portalServices';

export const usePortalData = portals => {
  return useQuery(
    queryKeys.portalData(portals[0]),
    () => fetchPortalData(portals[0]),
    {
      enabled: !!portals[0],
    }
  );
};

export const usePortalTeamMember = (portalId, userEmail) => {
  return useQuery(
    queryKeys.portalTeamMember(portalId),
    () => fetchTeamMemberData(portalId, userEmail),
    {
      enabled: !!portalId,
    }
  );
};

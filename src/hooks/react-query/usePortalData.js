import { useQuery } from 'react-query';
import { queryKeys } from './queryKeys';
import {
  fetchPortalClients,
  fetchPortalDataByIdOrUrl,
  fetchTeamMemberData,
} from '../../services/portalServices';

export const usePortalData = portals => {
  return useQuery(
    queryKeys.portalData(portals[0]),
    () => fetchPortalDataByIdOrUrl(portals[0]),
    {
      enabled: !!portals[0],
      refetchInterval: 60000,
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

export const usePortalClients = portal_id => {
  return useQuery(
    queryKeys.portalClients(portal_id),
    () => fetchPortalClients(portal_id),
    {
      enabled: !!portal_id,
    }
  );
};

export const useClientPortalData = domain => {
  return useQuery(
    ['portalData', domain.name],
    () => fetchPortalDataByIdOrUrl(domain.name, 'url'),
    {
      enabled: !!domain.name,
      refetchInterval: 60000,
    }
  );
};


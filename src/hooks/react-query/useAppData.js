import { useQuery } from 'react-query';
import { queryKeys } from './queryKeys';
import { fetchAppData } from '../../services/app';

export const useAppData = appId => {
  return useQuery(queryKeys.appData(appId), () => fetchAppData(appId), {
    enabled: !!appId,
  });
};

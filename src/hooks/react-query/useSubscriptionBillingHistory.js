import { useQuery } from 'react-query';
import { queryKeys } from './queryKeys';
import { fetchSubscriptionBillingHistory } from '../../services/subscriptionService';

const useSubscriptionBillingHistory = subscriptionId => {
  return useQuery(
    queryKeys.billingHistory(subscriptionId),
    () => {
      return fetchSubscriptionBillingHistory(subscriptionId);
    },
    {
      enabled: !!subscriptionId,
    }
  );
};
export default useSubscriptionBillingHistory;

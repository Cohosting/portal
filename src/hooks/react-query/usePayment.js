import { useQuery } from 'react-query';
import { fetchClientPaymentMethods } from '../../services/payment';
import { queryKeys } from './queryKeys';

export const useClientPaymentMethods = (
  customer_id,
  stripe_connect_account_id,
  settings
) => {
  return useQuery(
    queryKeys.clientPaymentMethod(customer_id),
    () =>
      fetchClientPaymentMethods(
        customer_id,
        stripe_connect_account_id,
        settings
      ),
    {
      enabled: !!customer_id && !!stripe_connect_account_id,
      cacheTime: 0,
    }
  );
};

import { useQuery } from 'react-query';
import { fetchClientPaymentMethods } from '../../services/payment';
import { queryKeys } from './queryKeys';
import { fetchCustomerPaymentMethods } from '../../services/subscriptionService';

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

export const useCustomerPaymentMethods = (customer_id, subscription_id) => {
  return useQuery(
    queryKeys.customerPaymentMethods(customer_id),
    () => fetchCustomerPaymentMethods(customer_id, subscription_id),
    {
      enabled: !!customer_id && !!subscription_id,
      cacheTime: 0,
    }
  );
};
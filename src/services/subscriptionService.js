import axiosInstance from '../api/axiosConfig';

export const fetchCustomerPaymentMethods = async (
  customer_id,
  subscription_id
) => {
  console.log(
    `Fetching payment methods for customer ${customer_id} and subscription ${subscription_id}`
  );
  const { data } = await axiosInstance.get(
    `/subscription/${subscription_id}/customer-payment-methods/`,
    {
      params: {
        customerId: customer_id,
      },
    }
  );
  return data.paymentMethods;
};

export const updateSubscriptionPaymentMethod = async (
  subscriptionId,
  paymentMethodId
) => {
  console.log(
    `Updating subscription payment method for subscription ${subscriptionId}`
  );
  const { data } = await axiosInstance.patch(
    `/subscription/update-subscription-payment-method/`,
    {
      subscriptionId,
      paymentMethodId,
    }
  );
  return data;
};

export const fetchSubscriptionBillingHistory = async subscriptionId => {
  console.log(`Fetching billing history for subscription ${subscriptionId}`);
  const { data } = await axiosInstance.get(
    `/subscription/${subscriptionId}/subscription-invoices`
  );
  return data.invoices;
};

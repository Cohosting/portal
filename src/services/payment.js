import axiosInstance from '../api/axiosConfig';
import { getPaymentMethodsType } from '../utils/invoices';

export const fetchClientPaymentMethods = async (
  customer_id,
  stripe_connect_account_id,
  settings
) => {
  const payment_methods = getPaymentMethodsType(settings);

  try {

  const { data } = await axiosInstance.get(
    `/stripe/connect/payment-methods/${customer_id}?stripe_connect_account_id=${stripe_connect_account_id}&payment_methods=${payment_methods.join(
      ','
    )}`
  );
  return data.paymentMethods; 
} catch (error) {
  console.error('Error fetching client payment methods:', error);
  throw error;
};
}




export const deletePaymentMethod = async paymentMethodId => {
  console.log(`Deleting payment method with id ${paymentMethodId}`);
  await axiosInstance.delete(`customers/payment-methods/${paymentMethodId}`);
};

export const retryPayment = async (
  stripe_subscription_id,
  payment_method_id,
  shouldMakeDefault
) => {
  try {
    const { data } = await axiosInstance.post(
      `/subscription/retry-and-set-default/`,
      {
        subscriptionId: stripe_subscription_id,
        paymentMethodId: payment_method_id,
        shouldMakeDefault,
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

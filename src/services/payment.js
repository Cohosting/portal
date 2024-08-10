import axiosInstance from '../api/axiosConfig';
import { getPaymentMethodsType } from '../utils/invoices';

export const fetchClientPaymentMethods = async (
  customer_id,
  stripe_connect_account_id,
  settings
) => {
  const payment_methods = getPaymentMethodsType(settings);

  const { data } = await axiosInstance.get(
    `/stripe/connect/payment-methods/${customer_id}?stripe_connect_account_id=${stripe_connect_account_id}&payment_methods=${payment_methods.join(
      ','
    )}`
  );
  return data.paymentMethods;
};

import axiosInstance from '../api/axiosConfig';

export const createStripeConnectAccount = async (
  portalOwnerId,
  stripeConnectAccountId,
  portalId,
  cb
) => {
  cb && cb(true);
  try {
    const response = await axiosInstance.post('stripe/connect/client/session', {
      userId: portalOwnerId,
      stripeConnectAccountId,
      portalId,
    });
    const { accountLink } = response.data;

    cb && cb(false);
    window.location.href = accountLink.url;
  } catch (err) {
    cb && cb(false);
  }
};

export const fetchStripeUser = async stripeConnectAccountId => {
  const { data } = await axiosInstance.get(
    `/stripe/connect/account/${stripeConnectAccountId}`
  );

  return data.stripeAccount;
};

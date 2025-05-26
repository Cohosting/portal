import axiosInstance from '../api/axiosConfig';

const registerClientWithStripe = async (
  email,
  id,
  stripe_connect_account_id
) => {
  const nodeUrl = import.meta.env.VITE_BASE_URL;
  if (!nodeUrl) {
    console.error('REACT_APP_BASE_URL is not defined.');
    return;
  }
  try {
    // Adds a client as a connected customer in Stripe
    const { data } = await axiosInstance.post(`stripe/connect/client`, {
      email,
      id,
      stripeConnectAccountId: stripe_connect_account_id,
    });

    console.log('Client registered with Stripe successfully:', data);
    return data.stripeCustomer;
  } catch (error) {
    console.error('Error registering client with Stripe:', error);
  }
};

export { registerClientWithStripe };

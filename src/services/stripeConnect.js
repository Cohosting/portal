import axiosInstance from '../api/axiosConfig';

const registerClientWithStripe = async (
  email,
  id,
  stripe_connect_account_id
) => {
 
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

const registerClientWithStripe = async (
  email,
  id,
  stripe_connect_account_id
) => {
  const nodeUrl = process.env.REACT_APP_NODE_URL;
  if (!nodeUrl) {
    console.error('REACT_APP_NODE_URL is not defined.');
    return;
  }
  try {
    const response = await fetch(
      `${nodeUrl}/connect/create-connected-customer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          id,
          stripeConnectAccountId: stripe_connect_account_id,
        }),
      }
    );

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to register client with Stripe:', errorData);
      return;
    }

    // Optionally, handle the response data
    const data = await response.json();
    console.log('Client registered with Stripe successfully:', data);
  } catch (error) {
    console.error('Error registering client with Stripe:', error);
  }
};

export { registerClientWithStripe };

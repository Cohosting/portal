export const createStripeConnectAccount = async (
  portalOwnerId,
  stripeConnectAccountId,
  portalId,
  cb
) => {
  cb &&  cb(true);
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NODE_URL}/connect/create-connect-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: portalOwnerId,
          stripeConnectAccountId,
          portalId,
        }),
      }
    );
    const { accountLink } = await response.json();
    cb && cb(false);
    window.location.href = accountLink.url;
  } catch (err) {
    cb && cb(false);
  }
};

export const fetchStripeUser = async stripeConnectAccountId => {
  const response = await fetch(
    `${process.env.REACT_APP_NODE_URL}/connect/get-connect-user?stripeConnectAccountId=${stripeConnectAccountId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch stripe user');
  }
  return response.json();
};
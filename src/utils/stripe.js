export const createStripeConnectAccount = async (
  portalOwnerId,
  stripeConnectAccountId,
  portalId,
  cb
) => {
  cb(true);
  try {
    const response = await fetch(
      'http://localhost:9000/connect/create-connect-session',
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
    cb(false);
    window.location.href = accountLink.url;
  } catch (err) {
    cb(false);
  }
};

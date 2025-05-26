export const getStripeConnectAccountId = domain =>
  domain?.portalData?.stripe_connect_account_id || '';

export const getCustomerId = invoice => invoice?.client?.customer_id || '';

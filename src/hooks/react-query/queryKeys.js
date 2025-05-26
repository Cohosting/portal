// src/hooks/react-query/queryKeys.js


export const queryKeys = {
  userData: 'userData',
  portalData: portalId => ['portalData', portalId],
  portalTeamMember: portalId => ['portalTeamMember', portalId],
  clientPortalData: url => ['clientPortalData', url],
  portalClients: portal_id => ['portalClients', portal_id],
  app: appId => ['app', appId],
  invoice: invoiceId => ['invoice', invoiceId],
  clientPaymentMethod: customer_id => ['client-payment-method', customer_id],
  conversations: portal_id => ['conversations', portal_id],
  messages: conversation_id => ['messages', conversation_id],
  invoices: filter => ['invoices', filter],
  invoiceCounts: portal_id => ['invoiceCounts', portal_id],
  customerPaymentMethods: customer_id => [
    'customerPaymentMethods',
    customer_id,
  ],
  billingHistory: subscriptionId => ['billingHistory', subscriptionId],
  teamSeats: portalId => ['teamSeats', portalId],
  openInvoices: portalId => ['openInvoices', portalId],
  recentActivities: portalId => ['recentActivities', portalId],
  teamMembers: portalId => ['teamMembers', portalId],
};


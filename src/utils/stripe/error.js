export const getStripeErrorMessage = errorCode => {
  switch (errorCode) {
    case 'account_closed':
      return {
        heading: 'Account Closed',
        description:
          'Your bank account has been closed. Please update your payment method.',
      };
    case 'generic_decline':
      return {
        heading: 'Payment Failure',
        description:
          'There was a failure processing your payment. Please try again or use a different payment method.',
      };
    case 'insufficient_funds':
      return {
        heading: 'Insufficient Funds',
        description:
          'Insufficient funds in your bank account. Please add funds or use a different payment method.',
      };
    case 'debit_not_authorized':
      return {
        heading: 'Debit Not Authorized',
        description:
          'Please contact your bank to resolve the issue. Once the bank authorizes, remove and re-add this payment method.',
      };
    case 'high_balance':
      return {
        heading: 'High Balance',
        description:
          'Your bank account balance is too high to process this payment. Please contact your bank or use a different payment method.',
      };
    default:
      return {
        heading: 'Unknown Error',
        description:
          'An unknown error occurred with this payment method during the transaction. Please try again or contact support for assistance.',
      };
  }
};

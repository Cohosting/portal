const getPaymentMethodsInfo = paymentMethods => {
  const hasPaymentMethods = paymentMethods.length > 0;
  return {
    hasPaymentMethods,
    heading: hasPaymentMethods
      ? 'Add new payment method'
      : 'No Payment Methods Available',
    description: hasPaymentMethods
      ? 'Please fill the following information'
      : 'You have no payment methods available. Please add a payment method to ensure smooth and uninterrupted service.',
  };
};

const getPaymentMethodErrorCode = error => {
  if (error?.code === 'card_declined') {
    return error.decline_code;
  }
  return error?.code;
};

export { getPaymentMethodsInfo, getPaymentMethodErrorCode };

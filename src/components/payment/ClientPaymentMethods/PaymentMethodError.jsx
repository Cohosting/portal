import React from 'react';
import { getStripeErrorMessage } from '../../../utils/stripe/error';

const PaymentMethodError = ({ paymentError }) => {
  console.log(paymentError.code);
  const { heading, description } = getStripeErrorMessage(paymentError?.code);

  return (
    <div className="mb-2 p-2 bg-red-100 border border-red-400 rounded-lg text-red-700">
      <h2 className="text-sm font-semibold">{heading}</h2>
      <p className="text-xs">{description}</p>
    </div>
  );
};

export default PaymentMethodError;

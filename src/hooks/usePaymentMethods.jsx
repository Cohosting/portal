import { useState, useEffect } from 'react';

export const usePaymentMethods = (paymentMethods) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  useEffect(() => {
    if (paymentMethods?.length) {
      setSelectedPaymentMethod(paymentMethods[0]?.id || null);
    }
  }, [paymentMethods]);

  return {
    selectedPaymentMethod,
    setSelectedPaymentMethod,

  };
};

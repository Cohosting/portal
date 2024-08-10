import React from 'react';
import SectionHeader from '../../SectionHeader';
import { usePaymentMethods } from '../../../hooks/usePaymentMethods';
import { usePayInvoice } from '../../../hooks/react-query/usePayInvoice';
import PaymentMethodItem from '../PaymentMethodItem';

const PaymentMethodList = ({
  paymentMethods,
  invoice,
  stripe_connect_account_id,
  setShowAddPaymentMethod,
}) => {
  const { selectedPaymentMethod, setSelectedPaymentMethod } =
    usePaymentMethods(paymentMethods);

  const { handlePayInvoice, isProcessing } = usePayInvoice(
    invoice,
    stripe_connect_account_id
  );

  const handlePayment = () => {
    if (selectedPaymentMethod) {
      handlePayInvoice(selectedPaymentMethod);
    }
  };

  return (
    <>
      <div className="mt-3">
        <SectionHeader
          heading="Payment Methods"
          description="You have the following payment methods. Select one to pay the invoice."
          buttonText="Add Payment Method"
          onClick={() => setShowAddPaymentMethod(true)}
        />
        <div className="divide-y-2 mt-5">
          {paymentMethods?.map(paymentMethod => (
            <PaymentMethodItem
              key={paymentMethod.id}
              paymentMethod={paymentMethod}
              isSelected={selectedPaymentMethod === paymentMethod.id}
              onSelect={() => setSelectedPaymentMethod(paymentMethod.id)}
              lastPaymentError={invoice?.last_payment_error}
            />
          ))}
        </div>
        <button
          className="btn-indigo"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay Invoice'}
        </button>
      </div>
    </>
  );
};

export default PaymentMethodList;

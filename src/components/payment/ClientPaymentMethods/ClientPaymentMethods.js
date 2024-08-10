import React, { useState } from 'react';
import { useClientPaymentMethods } from '../../../hooks/react-query/usePayment';
import SectionHeader from '../../SectionHeader';
import PaymentMethodList from './PaymentMethodList';
import AddPaymentMethodForm from './AddPaymentMethodForm';
import { Fade } from '@chakra-ui/react';
import PaymentFailed from '../PaymentFailed';
import { getPaymentMethodsInfo } from '../../../utils/payment_methods/payment_method_utils';

const ClientPaymentMethods = ({
  customer_id,
  stripe_connect_account_id,
  invoice,
}) => {
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(
    !!invoice?.last_payment_error
  );
  const { data: paymentMethods, isLoading } = useClientPaymentMethods(
    customer_id,
    stripe_connect_account_id,
    invoice?.settings
  );

  const handleRetryPayment = () => {
    setShowPaymentError(false);
    setShowAddPaymentMethod(false);
  };

  if (isLoading) return <div>Loading...</div>;

  const data = paymentMethods?.data || [];
  const { hasPaymentMethods, heading, description } =
    getPaymentMethodsInfo(data);

  const renderPaymentError = () =>
    showPaymentError && (
      <PaymentFailed
        handleRetryPayment={handleRetryPayment}
        invoice={invoice}
      />
    );

  const renderPaymentMethodList = () => (
    <Fade
      style={{
        display: !hasPaymentMethods || showAddPaymentMethod ? 'none' : 'block',
      }}
      in={hasPaymentMethods && !showAddPaymentMethod}
    >
      <PaymentMethodList
        stripe_connect_account_id={stripe_connect_account_id}
        invoice={invoice}
        paymentMethods={data}
        setShowAddPaymentMethod={setShowAddPaymentMethod}
      />
    </Fade>
  );

  const renderAddPaymentMethod = () => (
    <Fade in={!hasPaymentMethods || showAddPaymentMethod}>
      <SectionHeader
        heading={heading}
        description={description}
        buttonText="Add Payment Method"
        onClick={() => setShowAddPaymentMethod(true)}
        hideButton={showAddPaymentMethod}
      />
      {showAddPaymentMethod && (
        <AddPaymentMethodForm
          setShowAddPaymentMethod={setShowAddPaymentMethod}
          client={invoice?.client}
          customer_id={customer_id}
          stripe_connect_account_id={stripe_connect_account_id}
          settings={invoice?.settings}
        />
      )}
    </Fade>
  );

  return (
    <div className="mt-3">
      {renderPaymentError()}
      {!showPaymentError && (
        <>
          {renderPaymentMethodList()}
          {renderAddPaymentMethod()}
        </>
      )}
    </div>
  );
};

export default ClientPaymentMethods;

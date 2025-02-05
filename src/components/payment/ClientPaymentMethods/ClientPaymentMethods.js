import React, { useState } from 'react';
import { useClientPaymentMethods } from '../../../hooks/react-query/usePayment';
import SectionHeader from '../../SectionHeader';
import PaymentMethodList from './PaymentMethodList';
import AddPaymentMethodForm from './AddPaymentMethodForm';
import PaymentFailed from '../PaymentFailed';
import { getPaymentMethodsInfo } from '../../../utils/payment_methods/payment_method_utils';
import { Transition } from '@headlessui/react';

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
    <Transition
      show={hasPaymentMethods && !showAddPaymentMethod}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div>
        {' '}
        {/* Wrap in a div to resolve the Fragment issue */}
        <PaymentMethodList
          stripe_connect_account_id={stripe_connect_account_id}
          invoice={invoice}
          paymentMethods={data}
          setShowAddPaymentMethod={setShowAddPaymentMethod}
        />
      </div>
    </Transition>
  );

  const renderAddPaymentMethod = () => (
    <Transition
      show={!hasPaymentMethods || showAddPaymentMethod}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div>
        {' '}
        {/* Wrap in a div to resolve the Fragment issue */}
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
      </div>
    </Transition>
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
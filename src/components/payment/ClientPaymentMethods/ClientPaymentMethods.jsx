import React, { useState, useEffect } from 'react';
import { useClientPaymentMethods } from '../../../hooks/react-query/usePayment';
import SectionHeader from '../../SectionHeader';
import PaymentMethodList from './PaymentMethodList';
import AddPaymentMethodForm from './AddPaymentMethodForm';
import PaymentFailed from '../PaymentFailed';
import { getPaymentMethodsInfo } from '../../../utils/payment_methods/payment_method_utils';
import { Transition } from '@headlessui/react';
import { Loader } from 'lucide-react';

const ClientPaymentMethods = ({
  customer_id,
  stripe_connect_account_id,
  invoice,
  colorSettings
}) => {

  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(!!invoice?.last_payment_error);
  const { data: paymentMethods, isLoading, isFetched } = useClientPaymentMethods(
    customer_id,
    stripe_connect_account_id,
    invoice?.settings
  );

  useEffect(() => {
    if (invoice?.last_payment_error) {
      setShowPaymentError(true);
    }
  }, [invoice?.last_payment_error]);

  console.log({
    customer_id,
    stripe_connect_account_id,
    invoice,
    colorSettings,
    paymentMethods
  });

  const handleRetryPayment = () => {
    setShowPaymentError(false);
    setShowAddPaymentMethod(false);
  };

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
        <PaymentMethodList
          stripe_connect_account_id={stripe_connect_account_id}
          invoice={invoice}
          paymentMethods={data}
          setShowAddPaymentMethod={setShowAddPaymentMethod}
          colorSettings={colorSettings}
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
        <SectionHeader
          heading={heading}
          description={description}
          buttonText="Add Payment Method"
          onClick={() => setShowAddPaymentMethod(true)}
          hideButton={showAddPaymentMethod}
          styles={{
            backgroundColor: colorSettings?.sidebarBgColor || '#000',
            color: colorSettings?.sidebarActiveTextColor || '#fff'
          }}
        />
        {showAddPaymentMethod && (
          <AddPaymentMethodForm
            setShowAddPaymentMethod={setShowAddPaymentMethod}
            client={invoice?.client}
            customer_id={customer_id}
            stripe_connect_account_id={stripe_connect_account_id}
            settings={invoice?.settings}
            colorSettings={colorSettings}
          />
        )}
      </div>
    </Transition>
  );

  // Only show loading spinner until data is fetched
  if (isLoading || !isFetched) {
    return (
      <div className='flex justify-center items-center'>
        <Loader className="animate-spin text-gray-500" size={24} />
      </div>
    );
  }

  // Only show "no payment methods" when the data has been fetched and is empty
  if (!hasPaymentMethods && !showPaymentError) {
    return (
      <div className="mt-3 px-6">
        <p>No payment methods available. Please add one.</p>
        {renderAddPaymentMethod()}
      </div>
    );
  }

  return (
    <div className="mt-3 px-6">
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

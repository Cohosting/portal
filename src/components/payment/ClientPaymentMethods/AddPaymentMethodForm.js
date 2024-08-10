import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQueryClient } from 'react-query';
import { queryKeys } from '../../../hooks/react-query/queryKeys';
import { getPaymentMethodsType } from '../../../utils/invoices';

const Form = ({
  stripe,
  name,
  email,
  setShowAddPaymentMethod,
  customer_id,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const elements = useElements();
  const queryClient = useQueryClient();

  const handleSubmit = async event => {
    event.preventDefault();

    setIsLoading(true);
    try {
      const response = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name,
              email,
            },
          },
        },
      });
      console.log(response);

      if (response.error) {
        // Handle error
        console.error('Error confirming setup:', response.error.message);
        // Optionally, show an error message to the user
        setError(response.error.message);
        return;
      }

      await queryClient.invalidateQueries(
        queryKeys.clientPaymentMethod(customer_id)
      );
      setShowAddPaymentMethod(false);
    } catch (error) {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
      // Optionally, show an error message to the user
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          fields: {
            billingDetails: {
              name: 'never',
              email: 'never',
            },
          },
        }}
      />
      {error && <div className="text-red-500 my-3">{error}</div>}
      <div className="flex items-center mt-3">
        <button
          disabled={isLoading}
          className="mx-3"
          onClick={() => setShowAddPaymentMethod(false)}
        >
          Cancel
        </button>
        <button disabled={isLoading} type="submit" className="btn-indigo  ">
          {isLoading ? 'Saving...' : 'Save payment method'}
        </button>
      </div>
    </form>
  );
};
const AddPaymentMethodForm = ({
  customer_id,
  stripe_connect_account_id,
  client,
  setShowAddPaymentMethod,
  settings,
}) => {
  const [clientSecret, setClientSecret] = useState('');
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    if (!customer_id || !stripe_connect_account_id) return;

    (async () => {
      let payment_methods = getPaymentMethodsType(settings);
      const { data } = await axiosInstance.post(
        `/stripe/connect/setup-payment-method`,
        {
          customer_id,
          stripe_connect_account_id,
          payment_methods,
        }
      );

      setClientSecret(data.client_secret);
    })();
  }, [customer_id, stripe_connect_account_id]);

  useEffect(() => {
    if (!stripe_connect_account_id) return;
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY, {
      stripeAccount: stripe_connect_account_id,
    });
    stripePromise.then(stripe => {
      setStripe(stripe);
    });
  }, [stripe_connect_account_id]);

  return (
    <div className="mt-5">
      {clientSecret && stripe && (
        <Elements
          stripe={stripe}
          options={{
            clientSecret,
            appearance: {},
            loader: 'auto',
          }}
        >
          <Form
            setShowAddPaymentMethod={setShowAddPaymentMethod}
            stripe={stripe}
            name={client.name}
            email={client.email}
            customer_id={customer_id}
          />
        </Elements>
      )}
    </div>
  );
};

export default AddPaymentMethodForm;

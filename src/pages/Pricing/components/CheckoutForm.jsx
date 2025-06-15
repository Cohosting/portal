import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useSubscription from './../../../hooks/useSubscription';
import { usePortalData } from '../../../hooks/react-query/usePortalData';
import { Button } from '@/components/ui/button';

const CheckoutForm = ({
  selectedTier,
  priceId,
  isYearly,
  setShouldShowSubscription,
}) => {
  const { user, currentSelectedPortal } = useSelector((state) => state.auth);
  const { data: portal, isLoading } = usePortalData(currentSelectedPortal);
  const {
    error,
    loading,
    setError,
    setLoading,
    createSubscription,
  } = useSubscription();

  const stripe = useStripe();
  const elements = useElements();

  const handleError = (err) => {
    // stop any spinner
    setLoading(false);
    // save the error message in your hook state
    setError(err.message || 'Something went wrong.');
    // tell parent to show subscription UI
    setShouldShowSubscription(true);
    // show toast
    toast.error(err.message || 'Unexpected error, please try again.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // offline check
    if (!navigator.onLine) {
      handleError(new Error('You are offline. Please check your connection.'));
      return;
    }

    try {
      setLoading(true);

      if (!stripe || !elements) {
        throw new Error('Payment service is not ready. Please refresh.');
      }

      // validate & collect payment details
      const { error: submitError } = await elements.submit();
      if (submitError) throw submitError;

      // hide subscription UI while processing
      setShouldShowSubscription(false);

      // create the subscription on backend
      const { clientSecret } = await createSubscription({
        portal_id: portal.id,
        base_price_id: priceId,
        is_yearly: isYearly,
        initial_seat_count: 0,
      });

      // confirm with Stripe
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      });
      if (confirmError) throw confirmError;
      // On success, Stripe will redirect; no need to manually setLoading(false) here
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div className="my-4">
        <Button
          className="bg-black text-white hover:bg-gray-800"
          loading={loading}
          type="submit"
          disabled={!stripe || loading}
        >
          Submit Payment
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;

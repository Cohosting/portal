import React, { useContext, useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Button, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
export const SubscriptionForm = ({ priceId, isBrandingPaymentElementOpen }) => {
  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals)
  console.log(portal);

  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = error => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async event => {
    setIsLoading(true);
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    let response;

    if (isBrandingPaymentElementOpen) {
      response = fetch(
        `${import.meta.env.VITE_NODE_URL}/createAddOnSubscription`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            portalId: portal.id,
            removeBranding: true,
          }),
        }
      );
    } else {
      response = fetch(
        `${import.meta.env.VITE_NODE_URL}/create-subscription`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            customerId: portal.customerId,
            priceId: priceId,
            portalId: portal.id,
            // only owner id
            uid: portal.createdBy,
          }),
        }
      );
    }

    const res = await response; // Await the response to get the actual data
    console.log({ res });
    // Create the Subscription
    const { clientSecret } = await res.json();

    // Confirm the Subscription using the details collected by the Payment Element
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
      setIsLoading(false);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        isLoading={isLoading}
        mt={2}
        type="submit"
        disabled={!stripe || loading}
      >
        Submit Payment
      </Button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

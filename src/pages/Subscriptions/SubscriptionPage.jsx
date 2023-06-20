import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { SubscriptionForm } from './SubscriptionForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  'pk_test_51N43KcG6ekPTMWCwR2197fOHN32C1E5jNzPRm4kolK8KCRtleb4beHvMEqCCxgY8Ur53CXpsyTTx4mDu8cqjHFxb004bYWB6Cs'
);

const SubscriptionPage = ({ priceId, isPoweredBy }) => {
  const options = {
    mode: 'subscription',
    amount: 1099,
    currency: 'usd',
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  };
  return (
    <div>
      <h1>Subscription Page</h1>
      <Elements stripe={stripePromise} options={options}>
        <SubscriptionForm priceId={priceId} isPoweredBy={isPoweredBy} />
      </Elements>
    </div>
  );
};

export default SubscriptionPage;

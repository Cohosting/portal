import React, { useState } from 'react';
import {
    useStripe,
    useElements,
    PaymentElement,
} from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import useSubscription from './../../../hooks/useSubscription';
import { usePortalData } from '../../../hooks/react-query/usePortalData';
import { Button } from '@/components/ui/button';



const CheckoutForm = ({ selectedTier, priceId, isYearly, setShouldShowSubscription }) => {

    const { user, currentSelectedPortal } = useSelector(state => state.auth);
    const { data: portal, isLoading } = usePortalData(currentSelectedPortal)
    const {
        error,
        loading,
        setError,
        setLoading,
        createSubscription,
    } = useSubscription();

    const stripe = useStripe();
    const elements = useElements();



    const handleError = error => {
        setLoading(false);
        setError(error.message);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setLoading(true);

        if (!stripe) {
            return;
        }

        setLoading(true);

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
            handleError(submitError);
            setShouldShowSubscription(true);
            return;
        }
        setShouldShowSubscription(false);


        const response = await createSubscription({

            portal_id: portal.id,
            base_price_id: priceId,
            is_yearly: isYearly,
            initial_seat_count: 0

        });



        // Create the Subscription
        const { clientSecret } = response

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
            setLoading(false);
        } else {
            // Your customer is redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer is redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
        setLoading(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (

        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <div className='my-4'>
                <Button
                    className='bg-black text-white hover:bg-gray-800'
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

export default CheckoutForm
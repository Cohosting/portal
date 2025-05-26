import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51N43KcG6ekPTMWCwR2197fOHN32C1E5jNzPRm4kolK8KCRtleb4beHvMEqCCxgY8Ur53CXpsyTTx4mDu8cqjHFxb004bYWB6Cs');

export const SetupPaymentMethod = ({ isOpen, handleClose, forFailedPayment }) => {
    const [clientSecret, setClientSecret] = useState('');
    const { user, currentSelectedPortal } = useSelector(state => state.auth)
    const { data: portal } = usePortalData(currentSelectedPortal)
    useEffect(() => {
        if (!portal) return;
        // Create a Checkout Session as soon as the page loads
        fetch(`${import.meta.env.VITE_NODE_URL}/customers/setup-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerId: portal?.customerId,
                subscriptionId: portal?.subscriptions.current.subscriptionId,
                portalId: portal.id
            }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, [portal]);

    const options = {
        clientSecret,
        onComplete: (e) => console.log('After complete', e)
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={handleClose}>
                <div className="min-h-screen px-4 text-center">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    </TransitionChild>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                            <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                {forFailedPayment ? "Update your payment method" : "Save Card"}
                            </DialogTitle>
                            <div className="mt-2">
                                {clientSecret && (
                                    <EmbeddedCheckoutProvider
                                        stripe={stripePromise}
                                        options={options}
                                    >
                                        <EmbeddedCheckout />
                                    </EmbeddedCheckoutProvider>
                                )}
                            </div>
                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                    onClick={handleClose}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}

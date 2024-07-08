import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
} from '@chakra-ui/react';
import React, { useState, useEffect, useContext } from 'react';

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
    const { user } = useSelector(state => state.auth)
    const { data: portal } = usePortalData(user.portals)
    useEffect(() => {
        if (!portal) return;
        // Create a Checkout Session as soon as the page loads
        fetch(`${process.env.REACT_APP_NODE_URL}/customers/create-setup-session`, {
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
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader> {forFailedPayment ? "Update your payment method" : "Save Card"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {clientSecret && (
                        <EmbeddedCheckoutProvider
                            stripe={stripePromise}
                            options={options}

                        >
                            <EmbeddedCheckout />
                        </EmbeddedCheckoutProvider>
                    )}
                </ModalBody>

            </ModalContent>
        </Modal>
    )
}

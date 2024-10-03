import { useState, useEffect } from 'react';
import { fetchStripeUser } from '../utils/stripe';

export const useStripeUser = (stripeConnectAccountId) => {
    const [stripeUser, setStripeUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!stripeConnectAccountId) return;
        const getStripeUser = async () => {
            setIsLoading(true);
            try {
                const data = await fetchStripeUser(stripeConnectAccountId);
                setStripeUser(data);
            } catch (err) {
                setError(err.message);

            } finally {
                setIsLoading(false);
            }
        };
        getStripeUser();
    }, [stripeConnectAccountId]);

    return { stripeUser, isLoading, error };
};
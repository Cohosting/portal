import { useState, useEffect } from 'react';

const useUpdateSubscription = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateSubscription = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.REACT_APP_NODE_URL}/update-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            console.log(res);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, updateSubscription };
};
const useCancelDowngrade = (data) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const cancelDowngrade = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.REACT_APP_NODE_URL}/cancel-downgrade`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentSubscriptionId: data.subscriptions.current.subscriptionId,
                    portalId: data.id,
                    futureSubscriptionId: data.subscriptions.future.subscriptionId,
                    addOnSubscriptionId: data.addOnSubscription.subscriptionId,
                }),
            });
            console.log(res);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, cancelDowngrade };
};

const useCancel = (data) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const cancel = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.REACT_APP_NODE_URL}/cancel-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscriptionId: data.subscriptions.current.subscriptionId,
                    portalId: data.id,
                    addOnSubscriptionId: data.addOnSubscription.subscriptionId,
                }),
            });
            console.log(res);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, cancel };
};
const useReactivate = (data) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const reactivate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.REACT_APP_NODE_URL}/reactivate-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscriptionId: data.subscriptions.current.subscriptionId,
                    portalId: data.id,
                    addOnSubscriptionId: data.addOnSubscription.subscriptionId,
                }),
            });

            if (!res.ok) {
                throw new Error(`Failed to reactivate subscription: ${res.statusText}`);
            }

            console.log(res);
            // Handle successful reactivation (e.g., update UI, show success message)
        } catch (error) {
            setError(`Failed to reactivate subscription: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, reactivate };
};


export {
    useUpdateSubscription,
    useReactivate,
    useCancelDowngrade,
    useCancel,


}
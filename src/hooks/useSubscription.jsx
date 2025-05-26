

import { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { getFirstDayOfCurrentMonthInUnix, getFirstDayOfNextMonthInUnix } from "../utils/dateUtils";
import { toast } from 'react-toastify';

const useSubscription = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const createSubscription = async (subscriptionData) => {
        try {
            setLoading(true);
            setError(null);
            const firstDayOfCurrentMonthInUnix = getFirstDayOfCurrentMonthInUnix();
            const firstDayOfNextMonthInUnix = getFirstDayOfNextMonthInUnix();
            const response = await axiosInstance.post("/subscription", {
                ...subscriptionData,
                firstDayOfNextMonthInUnix,
                firstDayOfCurrentMonthInUnix
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateSeatCount = async (subscriptionId, seatCount) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.patch(`/subscription/${subscriptionId}/seats`, { seatCount });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
            throw err;
        } finally {
            setLoading(false);
        }
    };




    const upgradeSubscription = async (subscriptionId, newPriceId) => {

        try {
            setLoading(true);
            setError(null);
            const firstDayOfNextMonthInUnix = getFirstDayOfNextMonthInUnix();
            const response = await axiosInstance.post(`/subscription/${subscriptionId}/upgrade`, {
                newPriceId,
                firstDayOfNextMonthInUnix
            });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const downgradeSubscription = async (subscriptionId, newPriceId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.post(`/subscription/${subscriptionId}/downgrade`, { newPriceId });
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const cancelSubscriptionDowngrade = async (subscriptionId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.post(`/subscription/${subscriptionId}/cancel-subscription-downgrade`);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
            throw err;
        } finally {
            setLoading(false);
        }
    }


    const cancelSubscription = async (subscriptionId) => {
                try {
                    setLoading(true);
                    setError(null);
                    const response = await axiosInstance.post(`/subscription/${subscriptionId}/cancel`);
                    toast.success("Subscription cancelled successfully");
                    return response.data;
                } catch (err) {
                    setError(err.response?.data?.message || "An error occurred");
                    toast.error("An error occurred");
                    throw err;
                } finally {
                    setLoading(false);
                }
    };

    const reactiveSubscription = async (subscriptionId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.post(`/subscription/${subscriptionId}/reactivate-subscription`);

                    toast.success("Subscription reactivated successfully");
                    return response.data;
                } catch (err) {
                    setError(err.response?.data?.message || "An error occurred");
                    toast.error("An error occurred");
                    throw err;
        } finally {
                    setLoading(false);
        }
            }


    return {
        createSubscription,
        updateSeatCount,
        cancelSubscription,
        upgradeSubscription,
        cancelSubscriptionDowngrade,
        downgradeSubscription,
        reactiveSubscription,
        loading,
        setLoading,
        error,
        setError,

    };
};

export default useSubscription;

import React, { useState } from 'react';
import { CreditCard, Spinner, CheckCircle, Warning, ArrowsClockwise } from '@phosphor-icons/react';
import { createStripeConnectAccount } from '../../utils/stripe';

const StripeConnect = ({ portal, stripeUser, stripeStatus, refetchStripeUser }) => {
    const [loading, setLoading] = useState(false);

    const handleStripeConnect = async () => {
        try {
            setLoading(true);
            await createStripeConnectAccount(portal.created_by, portal.stripe_connect_account_id, portal.id, setLoading);
            await refetchStripeUser();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getStatusColor = () => {
        switch (stripeStatus) {
            case 'verified': return 'bg-green-600 hover:bg-green-700';
            case 'incomplete': return 'bg-yellow-600 hover:bg-yellow-700';
            case 'connected': return 'bg-blue-600 hover:bg-blue-700';
            default: return 'bg-indigo-600 hover:bg-indigo-700';
        }
    }

    const getStatusIcon = () => {
        switch (stripeStatus) {
            case 'verified': return <CheckCircle className="h-5 w-5" />;
            case 'incomplete': return <Warning className="h-5 w-5" />;
            case 'connected': return <ArrowsClockwise className="h-5 w-5" />;
            default: return <CreditCard className="h-5 w-5" />;
        }
    }

    const getButtonText = () => {
        switch (stripeStatus) {
            case 'verified': return 'Manage Stripe Account';
            case 'incomplete': return 'Complete Stripe Account';
            case 'connected': return 'Update Stripe Account';
            default: return 'Connect with Stripe';
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {stripeStatus === 'not_connected' ? 'Connect your Stripe account' : 'Stripe Account Status'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {stripeStatus === 'verified' && 'Your Stripe account is fully verified and ready to use.'}
                        {stripeStatus === 'incomplete' && 'Your Stripe account needs additional information. Please complete your profile.'}
                        {stripeStatus === 'connected' && 'Your Stripe account is connected but not fully verified.'}
                        {stripeStatus === 'not_connected' && 'Link your Stripe account to start adding clients and managing payments.'}
                    </p>
                </div>
                <div className="mt-8 space-y-6">
                    <button
                        onClick={handleStripeConnect}
                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${getStatusColor()} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out`}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            {getStatusIcon()}
                        </span>
                        {loading ? <Spinner className="animate-spin h-5 w-5 text-white" /> : getButtonText()}
                    </button>
                </div>
                {stripeStatus === 'not_connected' && (
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            By connecting your account, you agree to our{' '}
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StripeConnect;
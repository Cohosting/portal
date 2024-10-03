import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';

const StripeConnectStatus = ({ stripeUser, isLoading, createStripeAccount }) => {
    if (!stripeUser) return null;

    const isVerified = stripeUser?.details_submitted && stripeUser?.charges_enabled;
    const needsMoreInfo = stripeUser?.requirements?.currently_due.length > 0 || stripeUser?.requirements?.past_due.length > 0;

    return (
        <div className="w-full max-w-xl   rounded-lg overflow-hidden">
            <div className="py-4">
                <h2 className="text-2xl font-bold text-gray-800">Stripe Connect Status</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your Stripe account connection</p>
            </div>
            <div className="py-4">
                {isVerified ? (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">Account Verified</p>
                                <p className="mt-2 text-sm text-green-700">Your Stripe account is fully verified and ready to accept payments.</p>
                            </div>
                        </div>
                    </div>
                ) : needsMoreInfo ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-yellow-800">Action Required</p>
                                <p className="mt-2 text-sm text-yellow-700">Additional information or documents are needed to complete your account verification.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <ExclamationCircleIcon className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-blue-800">Connect Your Account</p>
                                <p className="mt-2 text-sm text-blue-700">Link your Stripe account to start accepting payments.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="py-4">
                <button
                    onClick={createStripeAccount}
                    disabled={isLoading}
                    className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className="flex items-center justify-center">
                        {isLoading ? (
                            "Processing..."
                        ) : isVerified ? (
                            "Manage Account"
                        ) : needsMoreInfo ? (
                            "Update Information"
                        ) : (
                            "Connect Stripe Account"
                        )}
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </span>
                </button>
            </div>
            <Disclosure>
                {({ open }) => (
                    <>
                        <DisclosureButton className="flex justify-between w-full py-2 text-sm font-medium text-left text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50">
                            <span className="px-4">Learn more about Stripe Connect</span>
                            <ChevronDownIcon
                                className={`${open ? 'transform rotate-180' : ''
                                    } w-5 h-5 text-gray-500 mr-4`}
                            />
                        </DisclosureButton>
                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <DisclosurePanel className="py-4 text-sm text-gray-700">
                                <p className="px-4">
                                    Stripe Connect allows you to accept payments and manage your financial transactions securely.
                                    It provides tools for onboarding, identity verification, and managing payouts.
                                </p>
                            </DisclosurePanel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        </div>
    );
};

export default StripeConnectStatus;
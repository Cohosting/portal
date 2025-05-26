import React from 'react';

const CurrentPlan = ({ currentPlan, onCancel, onReactivate, isLoading, subscription }) => {
    if (!currentPlan) return null;

    const { name, interval } = currentPlan;


    let currentPeriod = new Date(subscription.current_period_end).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-4 my-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-base font-semibold text-gray-800">Current Plan</h3>
                    <p className="text-sm text-blue-600 font-medium mt-0.5">
                        {name} <span className="text-gray-400">|</span> {interval}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        ${currentPlan[interval]?.price}/month
                    </p>
                </div>
                {
                    subscription.cancel_at_period_end ? (
                        <button
                            onClick={onReactivate}
                            className="px-3 py-1.5 bg-white text-green-500 text-xs border border-green-500 rounded-md hover:bg-green-50 transition-colors duration-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-t-2 border-r-2 border-gray-500 rounded-full animate-spin" />
                                    <span className="ml-2">Reactivating...</span>
                                </div>
                            ) : (
                                'Reactivate Subscription'
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={onCancel}
                            className="px-3 py-1.5 bg-white text-red-500 text-xs border border-red-500 rounded-md hover:bg-red-50 transition-colors duration-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-t-2 border-r-2 border-gray-500 rounded-full animate-spin" />
                                    <span className="ml-2">Cancelling...</span>
                                </div>
                            ) : (
                                'Cancel Subscription'
                            )}
                        </button>
                    )
                }
            </div>
            {
                subscription.cancel_at_period_end && (
                    <p className="mt-4 text-sm text-yellow-600 bg-yellow-100 p-2 rounded">
                        Note: Your subscription is scheduled to end on {currentPeriod}. You will retain access to all features until this date.
                    </p>
                )
            }
        </div>
    );
};

export default CurrentPlan;
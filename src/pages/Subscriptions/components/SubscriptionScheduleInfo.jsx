import React from 'react';

const SubscriptionScheduleInfo = ({
  newPlan,
  effectiveDate,
  onCancelDowngrade,
  isLoading
}) => {
  console.log({ effectiveDate })
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  // if invalid date
  if (!effectiveDate) {
    return null;
  }

  return (
    <div className=" py-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Plan Change</h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Your plan will change to:</p>
        <p className="text-md font-medium text-blue-600">{newPlan}</p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600">Effective from:</p>
        <p className="text-md font-medium">{formatDate(effectiveDate)}</p>
      </div>

      <button
        onClick={onCancelDowngrade}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
      >
        {
          isLoading ? 'Cancelling...' : 'Cancel Downgrade'
        }
      </button>


    </div>
  );
};

export default SubscriptionScheduleInfo;
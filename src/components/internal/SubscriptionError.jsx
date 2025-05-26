import { Calendar, AlertTriangle } from 'lucide-react';

const SubscriptionError = ({ subscriptionError }) => {
    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
    });
  };

    return (
      <div className="w-full max-w-md mb-4 overflow-hidden">
          <div className="p-6 px-0 space-y-4">
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="h-6 w-6" />
                      <h3 className="font-semibold text-lg">Subscription Error</h3>
                  </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <p className="text-red-700">{subscriptionError?.message}</p>
              </div>

              {subscriptionError.next_payment_attempt && (
                  <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <span>
                          Next payment attempt:{' '}
                          <span className="font-medium">
                              {formatDate(subscriptionError.next_payment_attempt)}
                          </span>
                      </span>
                  </div>
              )}

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <p className="text-sm text-yellow-700">
                      <span className="font-semibold">Important:</span> You have a 14-day
                      grace period to update your payment method. After this period, your
                      subscription will be cancelled immediately.
                  </p>
              </div>
          </div>
      </div>
    );
};

export default SubscriptionError;

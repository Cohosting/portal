import AlertDialog from '@/components/Modal/AlertDialog';
import { Button } from '@/components/ui/button';
import { Repeat } from 'lucide-react';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CurrentPlan = ({ currentPlan, onCancel, onReactivate, subscription }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isReactivateOpen, setIsReactivateOpen] = useState(false);
    if (!currentPlan) return null;



    const { name, interval } = currentPlan;


    let currentPeriod = new Date(subscription.current_period_end).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleCancel = async () => {
        try {
            setIsLoading(true);
            await onCancel();
            // one sec delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsCancelOpen(false);
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            toast.error('Failed to cancel subscription. Please try again later.');
        } finally {
            setIsCancelOpen(false);
            setIsLoading(false);
        }
    }


    const handleReactivate = async () => {
        try {
            setIsLoading(true);
            await onReactivate();
            // one sec delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
                setIsReactivateOpen(false);
        } catch (error) {
            console.error('Error reactivating subscription:', error);
            toast.error('Failed to reactivate subscription. Please try again later.');
        } finally {
            setIsReactivateOpen(false);
            setIsLoading(false);
        }
    }

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
                        <Button
                            onClick={setIsReactivateOpen.bind(null, true)}
                            className="px-3 py-1.5 bg-white text-green-500 text-xs border border-green-500 rounded-md hover:bg-green-50 transition-colors duration-200"
                        >

                            Reactivate Subscription

                        </Button>
                    ) : (
                        <Button
                                onClick={setIsCancelOpen.bind(null, true)}
                            className="px-3 py-1.5 bg-white text-red-500 text-xs border border-red-500 rounded-md hover:bg-red-50 transition-colors duration-200"
                        >

                                Cancel Subscription

                        </Button>
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

            {/* Alert dialoge for cancelinng */}
            <AlertDialog
                isOpen={isCancelOpen}
                onClose={() => setIsCancelOpen(false)}
                onConfirm={handleCancel}
                title="Cancel Subscription"
                message="Are you sure you want to cancel your subscription? You will lose access to all features after the current billing period ends."
                confirmButtonText={


                    // text withloading icon with saying cancelling subsscription for isLoading true otherwise cancel subscription make sure with icon
                    isLoading ? <div className='flex '>
                        <Loader className="animate-spin mr-2" size={16} />
                        Cancelling Subscription
                    </div> : 'Cancel Subscription'


                }
                confirmButtonColor="bg-red-500"
            />

            {/* Alert dialoge for reactivate */}
            <AlertDialog
  isOpen={isReactivateOpen}
  onClose={() => setIsReactivateOpen(false)}
  onConfirm={handleReactivate}
  title="Reactivate Subscription"
  message="Are you sure you want to reactivate your subscription? You will regain access to all features immediately."
  confirmButtonText={
    isLoading ? (
      <div className="flex items-center">
        <Loader className="animate-spin mr-2" size={16} />
        Reactivating Subscription
      </div>
    ) : (
      <div className="flex items-center">
         Reactivate Subscription
      </div>
    )
  }
  confirmButtonColor="bg-green-600"
  icon={<Repeat size={24} />}
  iconColor="text-green-600"
  iconBgColor="bg-green-100"
/>

        </div>
    );
};

export default CurrentPlan;
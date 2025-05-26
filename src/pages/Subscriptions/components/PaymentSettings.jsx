import { useState } from "react";
import PaymentMethod from "./PaymentMethod";
import AddCardPaymentModal from "./AddCardPaymentModal";
import { usePortalData } from "../../../hooks/react-query/usePortalData";
import { useSelector } from "react-redux";
import { useCustomerPaymentMethods } from "../../../hooks/react-query/usePayment";
import { deletePaymentMethod, retryPayment } from "../../../services/payment";
import { updateSubscriptionPaymentMethod } from "../../../services/subscriptionService";
import { queryKeys } from "../../../hooks/react-query/queryKeys";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { AlertCircle } from "lucide-react";

const PaymentSettings = ({
    subscription
}) => {

    const queryClient = useQueryClient();
    const { user, currentSelectedPortal } = useSelector((state) => state.auth);
    const { data: portal } = usePortalData(currentSelectedPortal)



    const { data: paymentMethods, isLoading } = useCustomerPaymentMethods(portal?.customer_id, subscription?.stripe_subscription_id)

    console.log({
        paymentMethods
    })

    const [isOpen, setIsOpen] = useState(false);




    const handleAddNew = () => {
        setIsOpen(true)
        // Implement add new payment method functionality
        console.log('Add new payment method');
    };




    const retryPaymentMethod = async (paymentMethodId, shouldMakeDefault = false) => {
        console.log('Retry payment method', paymentMethodId);

        try {
            const data = await retryPayment(subscription?.stripe_subscription_id
                , paymentMethodId, shouldMakeDefault);
            await queryClient.invalidateQueries(queryKeys.customerPaymentMethods(portal?.customer_id))
            // toast.success('Payment retried successfully');
        } catch (error) {
            console.error('Error retrying payment:', error);
            toast.error('Error retrying payment');
        }
    }

    return (
        <>

            <div className="max-w-md  bg-white pb-6 pt-3 rounded-lg ">
                <h2 className="text-base font-medium mb-1">Payment settings</h2>
                <p className="text-sm text-gray-600 mb-6">Update your plan settings</p> 

                {
                    isLoading && (
                        <div className="flex items-center ">
                            <Loader size={36} className="animate-spin m-5 " />
                        </div>
                    )
                }

                {subscription.subscription_error && (
                    <div className="rounded-md bg-red-50 p-4 my-2">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Payment Failed</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>Your last payment attempt was unsuccessful. Please retry or select a different payment method.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="space-y-4">
                    {paymentMethods?.map(method => (
                        <PaymentMethod
                            {...method}
                            key={method.id}
                            card={method.card}
                            isDefault={method.isDefault}
                            onSetDefault={() => updateSubscriptionPaymentMethod(subscription?.stripe_subscription_id, method.id)}
                            onDelete={deletePaymentMethod}
                            onRetry={retryPaymentMethod}
                            customerId={portal?.customer_id}
                            showRetryOptions={subscription.subscription_error}
                        />
                    ))}
                </div>

                <button
                    onClick={handleAddNew}
                    className="mt-4 text-blue-600 text-sm flex items-center"
                >
                    <span className="mr-2" >+</span> Add new method
                </button>


            </div>

            {
                isOpen && (
                    <AddCardPaymentModal subscriptionId={
                        subscription?.stripe_subscription_id
                    } customerId={portal?.customer_id} isOpen={isOpen} onClose={() => setIsOpen(false)} />
                )
            }


        </>

    );
};

export default PaymentSettings;
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Field, Label, Checkbox } from '@headlessui/react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import Button from '../../../components/internal/Button';
import { useQueryClient } from 'react-query';
import { queryKeys } from '../../../hooks/react-query/queryKeys';
import { Loader } from 'lucide-react';


const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);


const SetupForm = ({ clientSecret, subscriptionId, onClose, customerId }) => {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const queryClient = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();

  console.log(customerId)

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),

      },
    });

    if (error) {
      console.error(error);
      setLoading(false)
      onClose();
    } else {
      console.log('SetupIntent', setupIntent);

      if (enabled) {
        // Implement set as default payment method functionality
        console.log('Set as default payment method');
        await axiosInstance.patch('/subscription/update-subscription-payment-method', {
          subscriptionId,
          paymentMethodId: setupIntent.payment_method,
        });

      }
      await queryClient.invalidateQueries(queryKeys.customerPaymentMethods(customerId));
      setLoading(false);
      onClose();

    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />

      <Field className="flex cursor-pointer  items-center gap-2 mt-4">
        <Checkbox
          checked={enabled}
          onChange={setEnabled}
          className="group cursor-pointer block size-4 rounded border bg-white data-[checked]:bg-blue-500"
        >
          <svg className="stroke-white opacity-0 group-data-[checked]:opacity-100" viewBox="0 0 14 14" fill="none">
            <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Checkbox>
        <Label className={'text-sm font-medium cursor-pointer'}>Set as default payment method</Label>
      </Field>
      <Button disabled={loading} type='submit'
        className="mt-6 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300" >
        {
          loading ? <Loader className='animate-spin' /> : 'Add Payment Method'
        }
      </Button>

    </form>
  );
}

const AddCardPaymentModal = ({
  customerId,
  isOpen,
  onClose,
  onPaymentMethodAdded,
  subscriptionId
}) => {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!customerId) return;

    (async () => {
      const { data } = await axiosInstance.post(
        `/subscription/setup-payment-method`,
        { customerId }
      );
      console.log(data)
      setClientSecret(data.clientSecret);
    })();
  }, [customerId]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className="w-full max-w-lg space-y-4 rounded-lg bg-white p-6 shadow-lg"
        >
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add Payment Method
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Please enter your payment details to add a new payment method.
          </p>

          {/* Placeholder for Stripe Elements */}
          <div className="mt-4">
            {
              clientSecret ? (
                <Elements stripe={stripePromise}>
                  <SetupForm onClose={onClose} customerId={customerId} subscriptionId={subscriptionId} clientSecret={clientSecret} />
                </Elements>
              ) : (
                <div className='flex items-center justify-center'>
                  <Spinner className='animate-spin' size={25} />
                </div>
              )
            }


          </div>


        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddCardPaymentModal;

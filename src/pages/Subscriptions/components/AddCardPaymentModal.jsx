import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, Label, Checkbox } from '@headlessui/react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQueryClient } from 'react-query';
import { queryKeys } from '../../../hooks/react-query/queryKeys';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';


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
        className="mt-6 w-full rounded px-4 py-2 text-white  " >
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add Payment Method
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
                  <Loader className='animate-spin' size={25} />
                </div>
              )
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardPaymentModal;
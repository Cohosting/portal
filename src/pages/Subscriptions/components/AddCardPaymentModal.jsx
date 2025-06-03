import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQueryClient } from 'react-query';
import { queryKeys } from '../../../hooks/react-query/queryKeys';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SetupForm = ({ clientSecret, subscriptionId, onClose, customerId }) => {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const stripe = useStripe();
  const elements = useElements();

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
      setError(error);
      setLoading(false);
    } else {
      if (enabled) {
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
      <div className="flex items-center gap-2 mt-4">
  <Checkbox
    id="default-payment"
    checked={enabled}
    onCheckedChange={(checked) => setEnabled(Boolean(checked))}
    className="border border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
  />
  <Label htmlFor="default-payment" className="text-sm font-medium">
    Set as default payment method
  </Label>
</div>

      <Button
        className="mt-6 w-full rounded px-4 py-2 text-white bg-black hover:bg-gray-800"
        disabled={loading}
        type="submit"
      >
        {loading ? <Loader className="animate-spin" /> : 'Add Payment Method'}
      </Button>

      {error && (
        <p className="text-red-500 mt-2">{error?.message}</p>
      )}
    </form>
  );
};

const AddCardPaymentModal = ({
  customerId,
  isOpen,
  onClose,
  onPaymentMethodAdded,
  subscriptionId,
}) => {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!customerId) return;

    (async () => {
      const { data } = await axiosInstance.post(
        `/subscription/setup-payment-method`,
        { customerId }
      );
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

          <div className="mt-4">
            {clientSecret ? (
              <Elements stripe={stripePromise}>
                <SetupForm
                  onClose={onClose}
                  customerId={customerId}
                  subscriptionId={subscriptionId}
                  clientSecret={clientSecret}
                />
              </Elements>
            ) : (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin" size={25} />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardPaymentModal;

import { useMutation, useQueryClient } from 'react-query';
import { payInvoice } from '../../services/invoiceService';
import { queryKeys } from './queryKeys';
import { Bounce, toast } from 'react-toastify';

export const usePayInvoice = (invoice, stripeConnectAccountId) => {
  console.log(invoice);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    ({ paymentMethodId }) =>
      payInvoice(
        invoice.stripe_invoice_id,
        paymentMethodId,
        stripeConnectAccountId
      ),
    {
      onSuccess: () => {
        queryClient.setQueryData(queryKeys.invoice(invoice.id), oldData => ({
          ...oldData,
          status: 'processing',
        }));
      },
      onError: error => {
        const latestError = error.response.data.error;
        console.log(latestError);
        // render toast
        toast.error(
          'An error occurred with your payment method. Please try again or contact support.',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
            style: {
              width: '100%',
              maxWidth: '500px',
              fontSize: '14px',
            },
          }
        );
      },
    }
  );

  const handlePayInvoice = paymentMethodId => {
    mutate({ paymentMethodId });
  };

  return { handlePayInvoice, isProcessing: isLoading };
};

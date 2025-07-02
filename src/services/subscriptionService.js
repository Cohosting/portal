import axiosInstance from '../api/axiosConfig';
import { determineInvoiceType, groupLineItems, createCombinedDescription } from '@/utils/invoices';
import { processInvoiceLineItems } from '@/utils/lineItemUtils';

export const fetchCustomerPaymentMethods = async (
  customer_id,
  subscription_id
) => {
  console.log(
    `Fetching payment methods for customer ${customer_id} and subscription ${subscription_id}`
  );
  const { data } = await axiosInstance.get(
    `/subscription/${subscription_id}/customer-payment-methods/`,
    {
      params: {
        customerId: customer_id,
      },
    }
  );
  return data.paymentMethods;
};

export const updateSubscriptionPaymentMethod = async (
  subscriptionId,
  paymentMethodId
) => {
  console.log(
    `Updating subscription payment method for subscription ${subscriptionId}`
  );
  const { data } = await axiosInstance.patch(
    `/subscription/update-subscription-payment-method/`,
    {
      subscriptionId,
      paymentMethodId,
    }
  );
  return data;
};

export const fetchSubscriptionBillingHistory = async (subscriptionId) => {
  console.log(`Fetching billing history for subscription ${subscriptionId}`);

  const { data } = await axiosInstance.get(
    `/subscription/${subscriptionId}/subscription-invoices`
  );
  console.log({
    data
  })

  if (!Array.isArray(data.invoices)) {
    console.warn("Expected data.invoices to be an array.");
    return [];
  }

  const processedInvoices = data.invoices.map((invoice) => {
    const lines = invoice.lines?.data;

    if (!Array.isArray(lines) || lines.length === 0) {
      console.warn(`Invoice ${invoice.invoiceId} has no line items.`);
      return {
        invoiceId: invoice.invoiceId,
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.date,
        status: invoice.status,
        amount: 0,
        pdfUrl: invoice.pdfUrl,
        description: "No line items",
        type: "No Items",
        lineItems: []
      };
    }

    // Process line items using the imported utility
    const processedLines = processInvoiceLineItems(lines);

    // Group and combine line items using imported utility
    const { mainItems, prorationAdjustments } = groupLineItems(processedLines);
    
    // Use invoice amount directly
    const totalAmountRaw = invoice.amount ?? 0;

    // Create combined description using imported utility
    const description = createCombinedDescription(mainItems, prorationAdjustments);

    // Determine overall invoice type using imported utility
    const invoiceType = determineInvoiceType(processedLines);
    const isCredit = (invoice.amount ?? 0) < 0;
    const status = isCredit ? "credited" : invoice.status;
    
    return {
      invoiceId: invoice.invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date,
      status,
      amount: totalAmountRaw,
      pdfUrl: invoice.pdfUrl,
      description,
      type: invoiceType,
      lineItems: processedLines,
    };
  });

  return processedInvoices;
};
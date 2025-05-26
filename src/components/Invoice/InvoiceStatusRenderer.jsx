import ACHPaymentProcessing from "../payment/ACHPaymentProcessing";
import ClientPaymentMethods from "../payment/ClientPaymentMethods/ClientPaymentMethods";
import PaidInvoiceStatus from "./PaidInvoiceStatus";

const InvoiceStatusRenderer = ({ invoice, stripeConnectAccountId, customerId, colorSettings }) => {
  switch (invoice?.status) {
    case 'paid':
      return <PaidInvoiceStatus invoice={invoice} />;
    case 'processing':
      return <ACHPaymentProcessing />;
    default:
      return (
        <ClientPaymentMethods
          invoice={invoice}
          stripe_connect_account_id={stripeConnectAccountId}
          customer_id={customerId}
          colorSettings={colorSettings}
        />
      );
  }
};


export default InvoiceStatusRenderer;
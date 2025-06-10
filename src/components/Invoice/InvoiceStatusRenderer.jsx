import ACHPaymentProcessing from "../payment/ACHPaymentProcessing";
import ClientPaymentMethods from "../payment/ClientPaymentMethods/ClientPaymentMethods";
import PaidInvoiceStatus from "./PaidInvoiceStatus";
import InvoiceVoided from "./InvoiceVoided";
import InvoiceUncollectible from "./InvoiceUncollectible";

const InvoiceStatusRenderer = ({ invoice, stripeConnectAccountId, customerId, colorSettings }) => {
  
  switch (invoice?.status.toLowerCase()) {
    case 'paid':
      return <PaidInvoiceStatus invoice={invoice} />;
    case 'processing':
      return <ACHPaymentProcessing />;
    case 'void':
      return <InvoiceVoided invoice={invoice} />;
    case 'uncollectible':
      return <InvoiceUncollectible invoice={invoice} />;
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
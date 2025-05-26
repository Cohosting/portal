import { useInvoice } from '../react-query/useInvoice';
import { useDomainInfo } from '../useDomainInfo';

// hooks/useInvoiceDetails.js
export const useInvoiceDetails = id => {
   const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(id);

  return {
     invoice,
    isLoading: isInvoiceLoading,
  };
};

import { useInvoice } from '../react-query/useInvoice';
import { useDomainInfo } from '../useDomainInfo';

// hooks/useInvoiceDetails.js
export const useInvoiceDetails = id => {
  const { domain, isLoading: isDomainLoading } = useDomainInfo(true);
  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(id);

  return {
    domain,
    invoice,
    isLoading: isDomainLoading || isInvoiceLoading,
  };
};

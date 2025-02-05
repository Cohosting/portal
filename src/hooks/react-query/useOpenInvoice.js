import { useQuery } from 'react-query';
import { queryKeys } from './queryKeys';
import { getOpenInvoices } from '../../services/invoiceService';

const useOpenInvoice = currentSelectedPortal => {
  return useQuery({
    queryKey: queryKeys.openInvoices(currentSelectedPortal),
    queryFn: () => getOpenInvoices(currentSelectedPortal),
    enabled: !!currentSelectedPortal,
  });
};

export default useOpenInvoice;

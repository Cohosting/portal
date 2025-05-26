import { useQuery } from 'react-query';
import { queryKeys } from './queryKeys';
import {
  fetchInvoiceData,
  fetchInvoices,
  fetchInvoiceCounts,
} from '../../services/invoiceService';

export const useInvoice = id => {
  return useQuery(queryKeys.invoice(id), () => fetchInvoiceData(id), {
    enabled: !!id,
  });
};

export const useInvoicesWithFilter = filter => {
  return useQuery(['invoices', filter], () => fetchInvoices(filter), {
    enabled: !!filter.portalId && !!filter.clientId,
    keepPreviousData: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useInvoiceCounts = (portal_id, client_id) => {
  return useQuery(queryKeys.invoiceCounts(portal_id), fetchInvoiceCounts, {
    enabled: !!portal_id && !!client_id,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

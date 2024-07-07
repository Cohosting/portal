import { Box, Button, Flex, HStack, Spinner, Tag, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useDomainInfo } from '../../../hooks/useDomainInfo';
import { ClientInvoiceItem } from './InvoiceItem';
import { useClientAuth } from '../../../hooks/useClientAuth';
import { useClientPortalData } from '../../../hooks/react-query/usePortalData';
import { supabase } from '../../../lib/supabase';


export const ClientBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { domain } = useDomainInfo();
  const { data: portal, isLoading } = useClientPortalData(domain);
  const { clientUser } = useClientAuth(portal?.id);
  const [tag, setTag] = useState('all');

  useEffect(() => {
    if (!clientUser || isLoading || !portal) return;

    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!domain || !clientUser) throw new Error('Domain or client user is not specified.');
        console.log(portal)
        const portalId = portal.id;
        let invoiceQuery = supabase
          .from('invoices')
          .select('*')
          .eq('portal_id', portalId)
          .eq('client_id', clientUser.id);

        const { data: invoicesData, error: invoicesError } = await invoiceQuery;

        if (invoicesError) throw invoicesError;

        setInvoices(invoicesData);
      } catch (error) {
        console.error(error);
        setError(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [domain, clientUser, isLoading, tag, portal]);

  const handleRedirectPayment = (invoice) => {
    const { hosted_invoice_url } = invoice;
    // Redirect them to stripe invoice hosted page
    window.location.href = hosted_invoice_url;
  };

  return (
    <Box px={4} py={1} overflowY={'auto'}>
      <Text fontSize={'18px'} fontWeight={600}>Client Billing</Text>

      <Box>
        <Text color={'gray.600'}>Invoices</Text>
        <Box>
          {loading ? (
            <Flex mt={'20%'} alignItems={'center'} justifyContent={'center'}>
              <Spinner />
            </Flex>
          ) : (
            <>
              <HStack mt={2}>
                <Tag colorScheme={tag === 'all' ? 'blue' : 'gray'} onClick={() => setTag('all')} cursor={'pointer'} size={'lg'}>All</Tag>
                <Tag colorScheme={tag === 'paid' ? 'blue' : 'gray'} onClick={() => setTag('paid')} cursor={'pointer'} size={'lg'}>Paid</Tag>
                <Tag colorScheme={tag === 'pending' ? 'blue' : 'gray'} onClick={() => setTag('pending')} cursor={'pointer'} size={'lg'}>Pending</Tag>
              </HStack>
              {invoices?.map((invoice) => (
                <ClientInvoiceItem key={invoice.id} invoice={invoice}>
                  {invoice.status === 'finalized' ? (
                    <Button w={'150px'} size={'sm'} colorScheme="blue" onClick={() => handleRedirectPayment(invoice)}>
                      Pay
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        window.open(invoice.invoice_pdf, '_blank');
                      }}
                      variant={'link'}
                      textDecor={'underline'}
                    >
                      View receipt
                    </Button>
                  )}
                </ClientInvoiceItem>
              ))}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

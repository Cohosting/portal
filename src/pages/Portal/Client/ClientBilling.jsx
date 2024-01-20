import { Box, Button, Flex, HStack, Spinner, Tag, Text, VStack } from '@chakra-ui/react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { useSubdomain } from '../../../hooks/useSubdomain';
import { ClientAuthContext } from '../../../context/clientAuthContext';
import { ClientInvoiceItem } from './ClientInvoiceItem';
import { isSubdomain } from '../../../utils';

export const ClientBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { domain, isValid, isLoading } = useSubdomain();
  const { clientUser } = useContext(ClientAuthContext);
  const [tag, setTag] = useState('all')
  useEffect(() => {
    if (!clientUser || isLoading) return;
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!domain || !clientUser)
          throw new Error('Domain or client user is not specified.');

        const q = query(
          collection(db, 'portals'),
          isValid && !domain.includes('.')
            ? where('portalURL', '==', domain)
            : where('customDomain', '==', domain)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(el => el.data())[0];

        if (!data) throw new Error('No data found for the provided domain.');

        const portalId = data.id;
        let arrayQuery = [ 
          where('portalId', '==', portalId),
          where('customerId', '==', clientUser.customerId),
        ]
        if(tag === 'all') {

        } else if(tag === 'pending') {
          arrayQuery.push( where('status', '==', 'finalized'))

        } else if(tag === 'paid') {
          arrayQuery.push( where('status', '==', 'paid'))

        }

        const invoiceQuery = query(
          collection(db, 'invoices'),
          ...arrayQuery,
        );
        const invoicesSnapshot = await getDocs(invoiceQuery);
        const invoiceForPortal = invoicesSnapshot.docs.map(el => el.data());
        setInvoices(invoiceForPortal);
      } catch (error) {
        console.error(error);
        setError(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [domain, clientUser, isLoading, tag]);

  const handleRedirectPayment = invoice => {
    const { hosted_invoice_url } = invoice;
    // Redirect them to stripe invoice hosted page
    window.location.href = hosted_invoice_url;
  };

  console.log(invoices);

  return (
    <Box px={4} py={1} overflowY={'auto'}>
      <Text fontSize={'18px'} fontWeight={600} >Client Billing</Text>

      <Box>
        <Text color={'gray.600'} >Invoices</Text>
        <Box>
          {loading ? (
            <Flex mt={'20%'} alignItems={'center'} justifyContent={'center'}>
            <Spinner   />

            </Flex>
          ) : (
            <>
            <HStack mt={2}>
              <Tag colorScheme={tag === 'all' && 'blue'} onClick={() => setTag('all')} cursor={'pointer'} size={'lg'}>All</Tag>
              <Tag colorScheme={tag === 'paid' && 'blue'} onClick={() => setTag('paid')}  cursor={'pointer'} size={'lg'}> Paid</Tag>
              <Tag colorScheme={tag === 'pending' && 'blue'} onClick={() => setTag('pending')}  cursor={'pointer'} size={'lg'}>Pending</Tag>
            </HStack>
              {invoices?.map(invoice => (
                <ClientInvoiceItem
                  invoice={invoice}
                >
                  {
                    invoice.status === 'finalized' ? (
                      <Button w={'150px'} size={'sm'} colorScheme="blue" onClick={() => handleRedirectPayment(invoice)}>
                        Pay
                      </Button>
                    ) : (
                      <Button onClick={() => {
                        window.open(invoice.invoice_pdf, '_blank');

                      }} variant={'link'} textDecor={'underline'} >
                        View recipt
                      </Button>

                    )
                  }
                </ClientInvoiceItem>
              ))}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

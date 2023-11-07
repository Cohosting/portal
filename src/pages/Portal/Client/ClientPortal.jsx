import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { SubdomainCheck } from '../../../components/SubdomainCheck';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { ClientAuthContext } from '../../../context/clientAuthContext';
import { useSubdomain } from '../../../hooks/useSubdomain';
import { ClientDashboardLayout } from './ClientDashboardLayout';

// TODO: Update the logic for the subdomain because it now return domain and also update the fetching logic for the invoices 
export const ClientPortal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { domain, isLoading: isDomainLoading, isValid } = useSubdomain();
  const [invoices, setInvoices] = useState([]);
  const { clientUser } = useContext(ClientAuthContext);

  useEffect(() => {
    if (!clientUser || isDomainLoading) return;

    const getInvoicesFromFirebase = async () => {
      try {
        const ref = collection(db, 'invoices');
        const q = query(
          ref,
          isValid && !domain.includes('.')
            ? where('portalURL', '==', domain)
            : where('customDomain', '==', domain),
          where('status', '==', 'finalized')
        );
        const snapshot = await getDocs(q);
        const invoices = snapshot.docs.map(doc => doc.data());
        setInvoices(invoices);
      } catch (err) {
        console.log('Error getting invoices', err);
      }
    };

    getInvoicesFromFirebase();
  }, [clientUser, domain, isDomainLoading]);

  const createCheckoutSession = async invoice => {
    const res = await fetch(
      `${process.env.REACT_APP_NODE_URL}/connect/create-connect-checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: invoice.client.customerId,
          stripeConnectAccountId: 'acct_1N8TK0QEKRwEVaAN',
          line_items: invoice.lineItems,
        }),
      }
    );
    const { session } = await res.json();
    window.location.href = session.url;
  };

  const handleManageBillingInfo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_NODE_URL}/connect/create-connect-billing-session`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: clientUser.customerId,
            stripeConnectAccountId: 'acct_1N8TK0QEKRwEVaAN',
          }),
        }
      );
      const { session } = await res.json();
      window.location.href = session.url;
      setIsLoading(false);
    } catch (err) {
      console.log('Error creating billing session', err);
      setIsLoading(false);
    }
  };

  return (
    <SubdomainCheck domain={domain} isValid={isValid} isLoading={isDomainLoading}>
      <ClientDashboardLayout>
        <Box p={4}>
          <Button onClick={handleManageBillingInfo}>
            Manage your billing Info
          </Button>
          <Text>This is client subdomain content</Text>
          <Text>Your all invoice</Text>
          {invoices.map(invoice => (
            <Flex
              alignItems={'center'}
              justifyContent={'space-between'}
              border={'1px solid red'}
              p={2}
              my={2}
              borderRadius={'10px'}
              onClick={() => createCheckoutSession(invoice)}
            >
              <Box>
                <Text>Name: {invoice.client.name}</Text>
                <Text>Email: {invoice.client.email}</Text>
                <Text>Status: {invoice.status}</Text>
              </Box>
              {invoice.status === 'finalized' && <Button>Pay</Button>}
            </Flex>
          ))}
        </Box>
      </ClientDashboardLayout>
    </SubdomainCheck>
  );
};

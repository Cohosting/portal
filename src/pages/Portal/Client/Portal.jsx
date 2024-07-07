import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { SubdomainCheck } from '../../../components/SubdomainCheck';
import { useDomainInfo } from '../../../hooks/useDomainInfo';
import { ClientDashboardLayout } from './DashboardLayout';
import { createStripeBillingSessionAndReturn, fetchFinalizedInvoicesByDomain, redirectToStripeCheckoutSession } from '../../../services/portalServices';
import { useClientAuth } from '../../../hooks/useClientAuth';
import { PortalComponentDecider } from './PortalComponentDecider';

// TODO: Update the logic for the subdomain because it now return domain and also update the fetching logic for the invoices 
export const ClientPortal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { domain, isLoading: isDomainLoading, isValid } = useDomainInfo(true);
  const { clientUser } = useClientAuth(domain.portalData?.id);
  /*   useEffect(() => {
      if (!clientUser || isDomainLoading) return;
  
      const getInvoicesFromFirebase = async () => {
        try {
          const invoices = await fetchFinalizedInvoicesByDomain(isValid, domain.portalData?.id);
          setInvoices(invoices);
        } catch (err) {
          console.log('Error getting invoices', err);
        }
      };
  
      getInvoicesFromFirebase();
    }, [clientUser, domain, isDomainLoading]);
   */


  const handleManageBillingInfo = async () => {
    setIsLoading(true);
    try {
      const session = await createStripeBillingSessionAndReturn(clientUser.customerId);
      window.location.href = session.url;
      setIsLoading(false);
    } catch (err) {
      console.log('Error creating billing session', err);
      setIsLoading(false);
    }
  };

  return (
    <SubdomainCheck domain={domain.name} isValid={domain.existsInDb} isLoading={isDomainLoading}>
      <ClientDashboardLayout>
        <Box flex={1} overflowY="auto">
          <PortalComponentDecider />
        </Box>
      </ClientDashboardLayout>
    </SubdomainCheck>
  );
};

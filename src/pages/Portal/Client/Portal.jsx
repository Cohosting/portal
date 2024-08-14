import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { SubdomainCheck } from '../../../components/SubdomainCheck';
import { useDomainInfo } from '../../../hooks/useDomainInfo';
import { useClientAuth } from '../../../hooks/useClientAuth';
import { PortalComponentDecider } from './PortalComponentDecider';
import Layout from './Layout/Layout';
import { useConversationContext } from '../../../context/useConversationContext';

export const ClientPortal = () => {
  const { domain, isLoading: isDomainLoading, isValid } = useDomainInfo(true);
  // const { clientUser } = useClientAuth(domain.portalData?.id);

  const { listRef } = useConversationContext();


  return (
    <SubdomainCheck domain={domain.name} isValid={domain.existsInDb} isLoading={isDomainLoading}>
      <Layout>
        <Box ref={listRef} flex={1} overflowY="auto">
          <PortalComponentDecider portalData={domain.portalData} />
        </Box>
      </Layout>
    </SubdomainCheck>
  );
};

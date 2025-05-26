import React from 'react';
import { SubdomainCheck } from '../../../components/SubdomainCheck';
import { useDomainInfo } from '../../../hooks/useDomainInfo';
import { PortalComponentDecider } from './PortalComponentDecider';
import Layout from './Layout/Layout';
import { useConversationContext } from '../../../context/useConversationContext';
import PortalAccessUnavailable from '../../../components/internal/PortalAccessUnavailable';
import { Spinner } from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';
import PortalLoadingSkeleton from './components/PortalLoadingSkeleton';

export const ClientPortal = ({
  children,
}) => {
  const { domain, isLoading: isDomainLoading } = useDomainInfo(true);
  // const { clientUser } = useClientAuth(domain.portalData?.id);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const conversationId = urlParams.get('conversation-id');
  const location = useLocation();


  const { listRef } = useConversationContext();
  if (isDomainLoading) return  <PortalLoadingSkeleton />;

  if (domain.portalData && !domain.portalData?.subscription_id ) {
    return <PortalAccessUnavailable />;
  }
  // if url includes messages and conversation-id not exists in the url
   return (
    <SubdomainCheck domain={domain.name} isValid={domain.existsInDb} isLoading={isDomainLoading}>
      <Layout   >
        <div ref={listRef} className="flex-1">
        {
          children ? children :   <PortalComponentDecider portalData={domain.portalData} />
        }
         
        </div>
      </Layout>
    </SubdomainCheck>
  );
  
};

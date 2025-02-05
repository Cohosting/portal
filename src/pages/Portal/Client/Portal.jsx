import React from 'react';
import { SubdomainCheck } from '../../../components/SubdomainCheck';
import { useDomainInfo } from '../../../hooks/useDomainInfo';
import { PortalComponentDecider } from './PortalComponentDecider';
import Layout from './Layout/Layout';
import { useConversationContext } from '../../../context/useConversationContext';
import PortalAccessUnavailable from '../../../components/UI/PortalAccessUnavailable';
import { Spinner } from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';

export const ClientPortal = () => {
  const { domain, isLoading: isDomainLoading } = useDomainInfo(true);
  // const { clientUser } = useClientAuth(domain.portalData?.id);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const conversationId = urlParams.get('conversation-id');
  const location = useLocation();


  const { listRef } = useConversationContext();
  if (isDomainLoading) return <Spinner size={32} />;

  if (!domain.portalData?.subscription_id) {
    return <PortalAccessUnavailable />;
  }
  // if url includes messages and conversation-id not exists in the url
  let showHeader = location.pathname.includes('messages') && !conversationId
  return (
    <SubdomainCheck domain={domain.name} isValid={domain.existsInDb} isLoading={isDomainLoading}>
      <Layout showHeader={showHeader}  >
        <div ref={listRef} className="flex-1">
          <PortalComponentDecider portalData={domain.portalData} />
        </div>
      </Layout>
    </SubdomainCheck>
  );
};

import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';
import { useDomainInfo } from '../../hooks/useDomainInfo';
import { LoginForm } from './LoginForm';
import { ClientLogin } from '../Portal/Client/Login';
import PortalAccessUnavailable from '../../components/internal/PortalAccessUnavailable';
import {  PreparingPortal } from '../Portal/Client/components/PreparingPortal';

export const Login = () => {
  const { domain, isLoading } = useDomainInfo(true);
 
  // Function to determine which component to render based on the current state
  const renderContent = () => {
    if (domain.name && domain.name.includes('dashboard')) {
      return <LoginForm />;
    }

    if (domain.name) {
      if (isLoading) {
        return <PreparingPortal  />;
      }
      if (!domain.existsInDb) {
        return <div className="p-4">Invalid subdomain</div>;
      }

      if (domain.portalData.subscription_id) {
        return <ClientLogin portal={domain.portalData} />;
      } else {
        // give a message that the portal is not active
        return <PortalAccessUnavailable />;
      }
    }

    return null;
  };

  return (
    <div  >
        {renderContent()}
    </div>
  );
};
import React from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { useDomainInfo } from '../../hooks/useDomainInfo';
import { LoginForm } from './LoginForm';
import { ClientLogin } from '../Portal/Client/Login';
import PortalAccessUnavailable from '../../components/UI/PortalAccessUnavailable';

export const Login = () => {
  const { domain, isLoading } = useDomainInfo(true);
  // Function to determine which component to render based on the current state
  const renderContent = () => {
    if (domain.name && domain.name.includes('dashboard')) {
      return <LoginForm />;
    }

    if (domain.name) {
      if (isLoading) {
        return <Spinner />;
      }
      if (!domain.existsInDb) {
        return <Box>Invalid subdomain</Box>;
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
    <Box>
        {renderContent()}
    </Box>
  );
};
import React from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { useDomainInfo } from '../../hooks/useDomainInfo';
import { LoginForm } from './LoginForm';
import { ClientLogin } from '../Portal/Client/Login';
import { useClientPortalData } from '../../hooks/react-query/usePortalData';

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
      return <ClientLogin portal={domain.portalData} />;
    }

    return null;
  };

  return (
    <Box>
        {renderContent()}
    </Box>
  );
};
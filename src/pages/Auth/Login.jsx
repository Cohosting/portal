import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';
import { useSubdomain } from '../../hooks/useSubdomain';
import { LoginForm } from './LoginForm';
import { ClientLogin } from '../Portal/Client/ClientLogin';

export const Login = () => {
  const { domain, isValid, isLoading } = useSubdomain();

  // Function to determine which component to render based on the current state
  const renderContent = () => {
    // If the domain includes 'dashboard', show the LoginForm
    if (domain && domain.includes('dashboard')) {
      return <LoginForm />;
    }

    // For other domains, show loading, invalid subdomain message, or the ClientLogin based on the state
    if (domain) {
      if (isLoading) {
        return <Spinner />;
      }
      if (!isValid) {
        return <Box>Invalid subdomain</Box>;
      }
      return <ClientLogin />;
    }

    // Default case when there's no domain
    return null;
  };

    return (
    <Box>
        {renderContent()}
    </Box>
  );
};

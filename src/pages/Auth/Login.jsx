import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';
import { useSubdomain } from '../../hooks/useSubdomain';
import { LoginForm } from './LoginForm';
import { ClientLogin } from '../Portal/Client/ClientLogin';

export const Login = () => {
  const { subdomain, isSubdomainValid, isLoading } = useSubdomain();

  return (
    <Box>
      {!subdomain && <LoginForm />}
      {subdomain && (
        <Box>
          {isLoading && <Spinner />}
          {!isLoading && !isSubdomainValid && <Box>Invalid subdomain</Box>}
          {isSubdomainValid && !isLoading && <ClientLogin />}
        </Box>
      )}
    </Box>
  );
};

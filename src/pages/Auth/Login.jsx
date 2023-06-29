import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';
import { useSubdomain } from '../../hooks/useSubdomain';
import { LoginForm } from './LoginForm';
import { ClientLogin } from '../Portal/Client/ClientLogin';

export const Login = () => {
  const { domain, isValid, isLoading } = useSubdomain();

  console.log({ domain, isValid, isLoading })
  return (
    <Box>
      {!domain && <LoginForm />}
      {domain && (
        <Box>
          {isLoading && <Spinner />}
          {!isLoading && !isValid && <Box>Invalid subdomain</Box>}
          {isValid && !isLoading && <ClientLogin />}
        </Box>
      )}
    </Box>
  );
};

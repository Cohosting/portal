import { Box, Spinner } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useSubdomain } from '../../hooks/useSubdomain';
import { LoginForm } from './LoginForm';
import { ClientLogin } from '../Portal/Client/ClientLogin';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { domain, isValid, isLoading } = useSubdomain();


    return (
    <Box>
      {domain && domain.includes('dashboard') && <LoginForm />}
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

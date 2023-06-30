import React from 'react';
import { useSubdomain } from '../hooks/useSubdomain';
import { Box, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const SubdomainCheck = ({
  children,
  mainDomainComponent,
  isProtected = true,
}) => {
  const navigate = useNavigate();
  const { domain, isValid, isLoading } = useSubdomain();

  if (domain && isValid && !isLoading && isProtected) {
    const token = localStorage.getItem('sessionToken');
    if (!token) return navigate('/login');
  }

  return (
    <>
      {!domain && mainDomainComponent}

      {domain && (
        <Box>
          {isLoading && <Spinner />}
          {!isLoading && !isValid && <Box>Invalid subdomain</Box>}
          {isValid && !isLoading && children}
        </Box>
      )}
    </>
  );
};

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
  const { subdomain, isSubdomainValid, isLoading } = useSubdomain();

  if (subdomain && isSubdomainValid && !isLoading && isProtected) {
    const token = localStorage.getItem('sessionToken');
    if (!token) return navigate('/login');
  }

  return (
    <>
      {!subdomain && mainDomainComponent}

      {subdomain && (
        <Box>
          {isLoading && <Spinner />}
          {!isLoading && !isSubdomainValid && <Box>Invalid subdomain</Box>}
          {isSubdomainValid && !isLoading && children}
        </Box>
      )}
    </>
  );
};

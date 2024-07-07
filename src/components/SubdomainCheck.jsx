import React from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const SubdomainCheck = ({
  children,
  mainDomainComponent,
  isProtected = true,
  domain, isValid, isLoading
}) => {
  const navigate = useNavigate();

  if (domain && isValid && !isLoading && isProtected) {
    const token = localStorage.getItem('sessionToken');
    if (!token) return navigate('/login');
  }


  if (!domain && !mainDomainComponent) return null;

  if (!domain && mainDomainComponent) return mainDomainComponent;

  if (domain && isLoading) {

    return <Spinner />
  }

  if (domain && !isValid) return <Box>Invalid subdomain</Box>

  if (domain && isValid && !isLoading) {
    return children;
  };


};

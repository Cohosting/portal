import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { SubdomainCheck } from '../../../components/SubdomainCheck';

export const ClientPortal = () => {
  return (
    <SubdomainCheck>
      <Text>This is client subdomain content</Text>
    </SubdomainCheck>
  );
};

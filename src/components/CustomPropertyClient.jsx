import { Box, Flex, Input } from '@chakra-ui/react';
import React from 'react';

export const CustomPropertyClient = () => {
  return (
    <Flex>
      <Box w={'max-content'}></Box>
      <Box flex={1}>
        <Input />
      </Box>
    </Flex>
  );
};

import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

export const ClientInvoiceItem = ({ invoice, handleRedirectPayment }) => {
  return (
    <Box borderWidth="1px" borderRadius="md" p={4}>
      <Heading as="h4" size="md" marginBottom={4}>
        Items
      </Heading>
      {invoice.lineItems.map(item => (
        <Box key={item.name} marginBottom={4}>
          <Text fontWeight="bold" marginBottom={1}>
            {item.name}
          </Text>
          <Text>{`Price: ${item.price}`}</Text>
          <Text>{`Quantity: ${item.quantity}`}</Text>
          <Text>{`Total: ${item.total}`}</Text>
          {item.description && (
            <Text marginTop={2} fontStyle="italic">
              {item.description}
            </Text>
          )}
        </Box>
      ))}
      <Button colorScheme="blue" onClick={() => handleRedirectPayment(invoice)}>
        Pay
      </Button>
    </Box>
  );
};

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
          <Text>{`Price: ${item.unit_amount / 100}`}</Text>
          <Text>{`Quantity: ${item.quantity}`}</Text>
          <Text>{`Total: ${
            (item.unit_amount / 100) * Number(item.quantity)
          }`}</Text>
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

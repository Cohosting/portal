import React, { useEffect, useState } from 'react';
import {
  Box,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  IconButton,
  HStack,
  Text,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

export const ItemsComponent = ({ onUpdateItems }) => {
  const [items, setItems] = useState([
    { description: '', unit_amount: 0, quantity: 0 },
  ]);

  const handleItemChange = (index, field, value) => {
    setItems(prevItems =>
      prevItems.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleAddItem = () => {
    setItems(prevItems => [
      ...prevItems,
      { description: '', unit_amount: 0, quantity: 0 },
    ]);
  };

  const handleRemoveItem = index => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce(
      (total, item) => total + item.unit_amount * item.quantity,
      0
    );
  };

  useEffect(() => {
    onUpdateItems(
      items.map(item => ({ ...item, unit_amount: item.unit_amount * 100 }))
    );
  }, [items]);

  return (
    <Box>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Description</Th>
            <Th>unit_amount</Th>
            <Th>Quantity</Th>
            <Th>Total</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, index) => (
            <Tr key={index}>
              <Td>
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={e =>
                    handleItemChange(index, 'description', e.target.value)
                  }
                />
              </Td>
              <Td>
                <NumberInput
                  min={0}
                  value={item.unit_amount}
                  onChange={value =>
                    handleItemChange(index, 'unit_amount', value)
                  }
                >
                  <NumberInputField placeholder="unit_amount" />
                </NumberInput>
              </Td>
              <Td>
                <NumberInput
                  min={0}
                  value={item.quantity}
                  onChange={value => handleItemChange(index, 'quantity', value)}
                >
                  <NumberInputField placeholder="Quantity" />
                </NumberInput>
              </Td>
              <Td>{item.unit_amount * item.quantity}</Td>
              <Td>
                <IconButton
                  icon={<CloseIcon />}
                  variant="ghost"
                  onClick={() => handleRemoveItem(index)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <IconButton
        my={3}
        icon={<AddIcon />}
        variant="outline"
        onClick={handleAddItem}
        isDisabled={items.length === 10}
      />
      <HStack justify="flex-end">
        <Text fontWeight="bold">Total:</Text>
        <Spacer />
        <Text>{calculateTotal()}</Text>
      </HStack>
    </Box>
  );
};

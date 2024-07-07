import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Input,
  IconButton,
  HStack,
  Text,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Button,
  VStack,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { v4 as uuidv4 } from 'uuid';
export const ItemsComponent = ({ defaultValue, onUpdateItems }) => {
  let defaultState = {
    description: '',
    unit_amount: 0,
    quantity: 0
  }
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentItem, setCurrentItem] = useState(defaultState);

  const { description, unit_amount, quantity } = currentItem;

  const handleRemoveItem = (item) => {
    const filteredItems = defaultValue.filter((el) => el.uiid !== item.uiid);

    onUpdateItems(filteredItems)

  };

  const calculateTotal = () => {
    return defaultValue.reduce((total, item) => total + item.unit_amount * item.quantity, 0);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setCurrentItem({
      ...currentItem,
      [name]: (name === 'unit_amount' || name === 'quantity') ? Number(value) : value,
      uiid: uuidv4()
    })

  }

  useEffect(() => {
    if (isOpen) return;

    setCurrentItem(defaultState)
  }, [isOpen]);

  console.log({
    defaultValue
  })

  return (
    <Box zIndex={9999999999999}>
      <div
        style={{
          overflowX: 'auto', // Enable horizontal scrolling
          maxWidth: '100%', // Ensure the table doesn't extend beyond the container
        }}
      >
        <Modal size={'2xl'} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Invoice item</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

              <Flex gap={4} flexDir={'column'}>
                <Box>
                  <Text>Description</Text>
                  <Input onChange={handleChange} name='description' value={description} />
                </Box>
                <Box>
                  <Text>Unit amount</Text>
                  <Input onChange={handleChange} name='unit_amount' value={unit_amount} />
                </Box>
                <Box>
                  <Text>Quantity</Text>
                  <Input onChange={handleChange} name='quantity' value={quantity} />
                </Box>

                <Text>Total: ${currentItem.quantity * currentItem.unit_amount}$</Text>
              </Flex>

            </ModalBody>

            <ModalFooter>
              <Button variant={'ghost'}>Cancel</Button>
              <Button ml={2} onClick={() => {
                onUpdateItems([...defaultValue, currentItem]);
                onClose()
              }} >Create</Button>

            </ModalFooter>
          </ModalContent>
        </Modal>
        {
          defaultValue.map((el) => <Box
            key={el.uiid}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            mb={4}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <VStack spacing={2} align="flex-start">
              <Text textTransform={'capitalize'} fontSize="lg" fontWeight="bold">
                {el.description}
              </Text>
              <Text>
                <Badge colorScheme="green" fontSize="sm">
                  Unit Amount: ${el.unit_amount}
                </Badge>
              </Text>
              <Text>
                <Badge colorScheme="blue" fontSize="sm">
                  Quantity: {el.quantity}
                </Badge>
              </Text>
              <Text>
                <Badge colorScheme="purple" fontSize="sm">
                  Total: ${el.unit_amount * el.quantity}
                </Badge>
              </Text>
            </VStack>

            <Button onClick={() => handleRemoveItem(el)} colorScheme={'red'} size={'sm'} leftIcon={<DeleteIcon />}>
              Delete
            </Button>
          </Box>)
        }

      </div>

      <IconButton
        my={3}
        icon={<AddIcon />}
        variant="outline"
        onClick={() => onOpen()}
        isDisabled={defaultValue.length === 10}
      />
      <HStack justify="flex-end">
        <Text fontWeight="bold">Total:</Text>
        <Spacer />
        <Text>{calculateTotal()}</Text>
      </HStack>
    </Box>
  );
};
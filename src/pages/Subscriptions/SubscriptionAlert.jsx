import React from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

export const SubscriptionAlert = ({
  plan,
  onUpdate,
  isOpen,
  onClose,
  isLoading,
  nextPlan,
}) => {
  const buttonBgColor = useColorModeValue('blue.500', 'blue.300');
  const buttonTextColor = useColorModeValue('white', 'gray.800');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Subscription Alert</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert status="success" mb={2}>
            <AlertIcon />
            <Flex flexDir={'column'}>
              <Text>Current Plan: {plan}</Text>
              <Text>Next plan: {nextPlan}</Text>
            </Flex>
          </Alert>

          <Text>Are you sure you wanna update your subscription?</Text>

          <Flex justify="center" my={3}>
            <Button mx={3} onClick={onClose}>
              <Text color="red.500">Cancel</Text>
            </Button>
            <Button
              isLoading={isLoading}
              onClick={onUpdate}
              bg={buttonBgColor}
              color={buttonTextColor}
            >
              Update Plan
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { generateSecurePassword } from '../../utils';
import { supabase } from '../../lib/supabase';

// ClientInviteSuccessModal is a modal that appears after successfully adding a client.
// It offers the option to send an invitation email to the newly added client.
export const ClientInviteSuccessModal = ({ isOpen, onClose, temporaryClient }) => {
  const { user } = useSelector(state => state.auth);
  // Fetch portal data based on the current user's portal association.
  const { data: portal } = usePortalData(user?.portals);
  const [isLoading, setIsLoading] = useState(false);

  // Function to send an invitation email to the client.
  const sendInvitationEmail = async () => {
    try {
      setIsLoading(true);
      // Generate a secure password for the client.
      let password = generateSecurePassword();
      // Hash the password before storing it.
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the client's status and password in the database using Supabase.
      console.log({ password, temporaryClient })
      const { data, error } = await supabase
        .from('clients')
        .update({ status: 'pending', password: hashedPassword })
        .match({ id: temporaryClient.id });

      if (error) {
        console.error('Error updating client data:', error);
        throw error;
      } else {
        console.log('Client data updated successfully:', data);
      }

      // Placeholder for sending the actual email. This part needs to be implemented.
      // The email should contain the portal URL and the generated password.

      setIsLoading(false);
      onClose();
    } catch (error) {
      console.log(`Error sending invitation email: ${error}`);
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invitation Email</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize={'28px'} mb={4}>
            Do you want to send an invitation email to the client?
          </Text>
          <Button
            isLoading={isLoading}
            onClick={sendInvitationEmail}
            colorScheme={'green'}
          >
            Yes
          </Button>
        </ModalBody>

        <ModalFooter>
          <Button variant={'ghost'} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
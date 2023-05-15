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
import React, { useContext, useState } from 'react';
import bcrypt from 'bcryptjs';
import { addMail } from './../../lib/email';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/authContext';
export const InviteSuccessModal = ({ isOpen, onClose, temporaryClient }) => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const sentMail = async () => {
    try {
      setIsLoading(true);
      let password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);

      const ref = doc(db, 'portalMembers', temporaryClient.id);
      await updateDoc(ref, {
        status: 'pending',
        password: hashedPassword,
      });
      await addMail(
        temporaryClient.email,
        temporaryClient.name,
        `
      <div>
        <p>link: http://${user.portalURL}.localhost:3000/login</p>
        password: ${password}
      </div>
      `
      );
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.log(`Error sending mail: ${error}`);
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sent mail</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize={'28px'} mb={4}>
            Do you want sent invite mail?
          </Text>
          <Button
            isLoading={isLoading}
            onClick={sentMail}
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

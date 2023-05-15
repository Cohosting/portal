
//create a invite modal  form with email name and account type(client or member) using chakra UI


import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack } from '@chakra-ui/react'
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const InviteForm = ({
  isOpen,
  onClose,
  onToggleSuccess,
  setTemporaryClient,
}) => {
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [inviteState, setInviteState] = useState({
    email: '',
    name: '',
    accountType: 'client',
  });

  const handleChange = e => {
    setInviteState({
      ...inviteState,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMember = async () => {
    try {
      setIsLoading(true);
      const memberRef = query(
        collection(db, 'portalMembers'),
        where('email', '==', inviteState.email)
      );
      const memberSnapshot = await getDocs(memberRef);
      if (!memberSnapshot.empty) {
        setIsError('Member already exists');
        setIsLoading(false);
        return;
      }
      const ref = doc(collection(db, 'portalMembers'));
      let member = {
        ...inviteState,
        addedBy: user.uid,
        status: 'restricted',
        portalId: user.portals[0],
        id: ref.id,
        portalURL: user.portalURL,
      };
      await setDoc(ref, member);
      await updateDoc(doc(db, 'portals', user.portals[0]), {
        members: arrayUnion(ref.id),
      });
      setTemporaryClient(member);
      onClose();
      onToggleSuccess();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch">
            <Box>
              <Text mb={1}>Email</Text>
              <Input
                name="email"
                value={inviteState.email}
                onChange={handleChange}
              />
            </Box>
            <Box>
              <Text mb={1}>Name</Text>
              <Input
                name="name"
                value={inviteState.name}
                onChange={handleChange}
              />
            </Box>
            <Box>
              <Text mb={1}>Account type</Text>
              <Select
                value={inviteState.accountType}
                name="accountType"
                placeholder="Select option"
                onChange={handleChange}
              >
                <option value="member">Member</option>
                <option value="client">Client</option>
              </Select>
            </Box>
          </VStack>
          {isError && (
            <Text my={3} color={'red'} fontSize={'14px'}>
              {isError}
            </Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant={'ghost'} onClick={onClose}>
            Close
          </Button>
          <Button isLoading={isLoading} onClick={handleAddMember}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

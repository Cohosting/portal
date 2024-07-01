
//create a invite modal  form with email name and account type(client or member) using chakra UI


import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack } from '@chakra-ui/react'
import React, { useContext, useState } from 'react';
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
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';

export const InviteForm = ({
  isOpen,
  onClose,
  onToggleSuccess,
  setTemporaryClient,
}) => {
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals)
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
      // need to change
      const memberRef = query(
        collection(db, 'portalMembers'),
        where('portalId', '==', portal.id),
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
        portalId: portal.id,
        id: ref.id,
        createdAt: new Date().toDateString(),
      };
      await setDoc(ref, member);
      await updateDoc(doc(db, 'portals', portal.id), {
        // member or client
        members: arrayUnion(ref.id),
      });
      await fetch(
        `${process.env.REACT_APP_NODE_URL}/connect/create-connected-customer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: inviteState.email,
            id: ref.id,
            stripeConnectAccountId: portal.stripeConnectAccountId,
          }),
        }
      );
      setTemporaryClient(member);
      onClose();
      onToggleSuccess();
      setIsLoading(false);
    } catch (err) {
      console.log(err.message);
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
                isReadOnly={true}
                defaultValue={inviteState.accountType}
                name="accountType"
                placeholder="Select option"
              >
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

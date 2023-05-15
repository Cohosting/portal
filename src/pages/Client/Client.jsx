import { Box, Button, Divider, Flex, Text, useDisclosure } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { InviteForm } from './InviteForm';
import { addMail } from '../../lib/email';
import { InviteSuccessModal } from './InviteSuccessModal';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

export const Client = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [temporaryClient, setTemporaryClient] = useState(null);
  const [clients, setClients] = useState([]);
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isOpenSuccess, onToggle: onToggleSuccess } = useDisclosure();

  useEffect(() => {
    const collecRef = collection(db, 'portalMembers');
    const q = query(collecRef, where('portalURL', '==', user.portalURL));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const clients = querySnapshot.docs.map(doc => doc.data());
      setClients(clients);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Layout>
      <Box p={4}>
        <Box py={3}>
          <Flex alignItems={'center'} justifyContent={'space-between'}>
            <Text>Client</Text>
            <Button onClick={onToggle} mb={3}>
              Add
            </Button>
          </Flex>
          <Divider />
        </Box>
        <Box>
          {clients.map(el => (
            <Box
              onClick={() => navigate(`/client/details/${el.id}`)}
              border={'1px solid gray'}
              borderRadius={'8px'}
              p={2}
              cursor={'pointer'}
              _hover={{
                bg: 'gray.200',
              }}
              my={3}
            >
              <Text>Name: {el.name}</Text>
              <Text>Email: {el.email}</Text>
              <Text>Status: {el.status}</Text>
            </Box>
          ))}
        </Box>
      </Box>
      <InviteForm
        isOpen={isOpen}
        onClose={onToggle}
        onToggleSuccess={onToggleSuccess}
        setTemporaryClient={setTemporaryClient}
      />
      <InviteSuccessModal
        temporaryClient={temporaryClient}
        isOpen={isOpenSuccess}
        onClose={onToggleSuccess}
      />
    </Layout>
  );
};

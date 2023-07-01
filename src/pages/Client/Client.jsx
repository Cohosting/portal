import {
  Box,
  Button,
  Divider,
  Flex,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { InviteForm } from './InviteForm';
import { InviteSuccessModal } from './InviteSuccessModal';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import Table from './ClientTable';
import { AddIcon } from '@chakra-ui/icons';
import { PortalContext } from '../../context/portalContext';
import { StripeConnectValidation } from './StripeConnectValidation';
import { usePlanName } from '../../hooks/usePlanName';
import { prices } from '../../utils/prices';
import { ClientUsageLimit } from '../../components/UI/ClientUsageLimit';
export const Client = () => {
  const [shouldShowAddClient, setShouldShowAddClient] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { portal } = useContext(PortalContext);
  const planName = usePlanName(prices, portal?.subscriptions?.current?.priceId);
  const [temporaryClient, setTemporaryClient] = useState(null);
  const [clients, setClients] = useState([]);
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isOpenSuccess, onToggle: onToggleSuccess } = useDisclosure();
  const [shouldLimitAddingClient, setShouldLimitAddingClient] = useState(false);
  const columns = ['Name', 'Status', 'Creation date', 'Email'];
  let sortableColumns = [];
  useEffect(() => {
    if (!portal) return;
    const collecRef = collection(db, 'portalMembers');
    const q = query(collecRef, where('portalId', '==', portal.id));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const clients = querySnapshot.docs.map(doc => doc.data());
      let data = [];
      clients.forEach(el => {
        data.push({
          Name: (
            <Flex alignItems={'center'}>
              <Flex
                alignItems={'center'}
                justifyContent={'center'}
                w={'30px'}
                h={'30px'}
                bg={'#7cae7a'}
                color={'white'}
                borderRadius={'4px'}
              >
                {' '}
                {el.name[0]}
              </Flex>
              <Box ml={3}>
                <Text>{el.name}</Text>
                <Text fontSize={'12px'}>{el.email}</Text>
              </Box>
            </Flex>
          ),
          Email: el.email,
          Status: el.status,
          ['Creation date']: el.createdAt,
        });
      });

      setClients(data);
    });

    return () => {
      unsubscribe();
    };
  }, [portal]);



  return (
    <Layout>
      <StripeConnectValidation
        setShouldShowAddClient={setShouldShowAddClient}
      />
      <ClientUsageLimit
        portal={portal}
        clients={clients}
        setShouldLimitAddingClient={setShouldLimitAddingClient}
      />
      <Box>
        <Box pt={3} px={'20px'}>
          <Flex alignItems={'center'} justifyContent={'space-between'}>
            <Text fontSize={'14px'}>Client</Text>
            {shouldShowAddClient && !shouldLimitAddingClient && (
              <Button
                size={'sm'}
                bg={'black'}
                color={'white'}
                leftIcon={<AddIcon />}
                onClick={onToggle}
                mb={3}
                fontSize={'14px'}
              >
                New client
              </Button>
            )}
          </Flex>
        </Box>

        <Divider />

        <Box>
          {!clients ? (
            <Flex alignItems={'center'} justifyContent={'center'}>
              <Spinner />
            </Flex>
          ) : (
            <Table
              columns={columns}
              data={clients}
              sortableColumns={sortableColumns}
            />
          )}
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

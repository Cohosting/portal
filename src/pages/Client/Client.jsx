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

import { useNavigate, useParams } from 'react-router-dom';
import Table from './ClientTable';
import { AddIcon } from '@chakra-ui/icons';
import { StripeConnectValidation } from './StripeConnectValidation';
import { usePlanName } from '../../hooks/usePlanName';
import { prices } from '../../utils/prices';
import { ClientUsageLimit } from '../../components/UI/ClientUsageLimit';
import usePortalMembers from '../../hooks/usePortalMembers';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
export const Client = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: portal } = usePortalData(user?.portals)
  const {
    clients
  } = usePortalMembers(portal)


  const [shouldShowAddClient, setShouldShowAddClient] = useState(false);
  const navigate = useNavigate();
  const planName = usePlanName(prices, portal?.subscriptions?.current?.priceId);
  const [temporaryClient, setTemporaryClient] = useState(null);
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isOpenSuccess, onToggle: onToggleSuccess } = useDisclosure();
  const [shouldLimitAddingClient, setShouldLimitAddingClient] = useState(false);


  const columns = ['Name', 'Status', 'Creation date', 'Email'];
  let sortableColumns = [];



  return (
    <Layout>
      <StripeConnectValidation
        portal={portal}
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

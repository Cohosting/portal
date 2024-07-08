import {
  Box,

  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { InviteForm } from './InviteForm';
import { ClientInviteSuccessModal } from './ClientInviteSuccessModal';

import { useNavigate } from 'react-router-dom';
import { StripeConnectValidation } from './StripeConnectValidation';
import { usePlanName } from '../../hooks/usePlanName';
import { prices } from '../../utils/prices';
import { ClientUsageLimit } from '../../components/UI/ClientUsageLimit';
import usePortalClientData from '../../hooks/usePortalClientData';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import ClientTable from '../../components/table/ClientTable';
export const Client = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: portal } = usePortalData(user?.portals)
  const {
    clientData: clients,
    isNotificationOpen,
    toggleNotification
  } = usePortalClientData(portal)


  const [shouldShowAddClient, setShouldShowAddClient] = useState(false);
  const navigate = useNavigate();
  const planName = usePlanName(prices, portal?.subscriptions?.current?.priceId);
  const [temporaryClient, setTemporaryClient] = useState(null);
  const { isOpen, onToggle } = useDisclosure();
/*   const { isOpen: isOpenSuccess, onToggle: onToggleSuccess } = useDisclosure();
 */  const [shouldLimitAddingClient, setShouldLimitAddingClient] = useState(false);


  const columns = ['Name', 'Status', 'Creation date', 'Email'];
  let sortableColumns = [];


  return (
    <Layout headerName='Clients'>

      {/* <Button onClick={() => {
        console.log(`${portal.portal_url}.localhost:3000/login`)
        window.location.href = `http://${portal.settings.subdomain}.localhost:3000/login`
      }}>
        Demo client page
      </Button>
      <StripeConnectValidation
        portal={portal}
        setShouldShowAddClient={setShouldShowAddClient}
      />
      <ClientUsageLimit
        portal={portal}
        clients={clients}
        setShouldLimitAddingClient={setShouldLimitAddingClient}
      /> */}
      {/*       <Box>
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
          {!clients?.length ? (
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
        </Box> */}
      <Box>
        <div className="px-4 sm:px-6 lg:px-8 pt-7">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">Clients</h1>
              <p className="mt-2 text-sm text-gray-700">
                A list of all the clients in your portal including their name,  email and status.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                onClick={onToggle}
                type="button"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add client
              </button>
            </div>
          </div>
          <ClientTable
            clients={clients}
          />
        </div>
      </Box>
      <InviteForm
        isOpen={isOpen}
        onClose={onToggle}
        onToggleSuccess={toggleNotification}
        setTemporaryClient={setTemporaryClient}
      />
      <ClientInviteSuccessModal
        temporaryClient={temporaryClient}
        isOpen={isNotificationOpen}
        onClose={toggleNotification}
      />
    </Layout>
  );
};

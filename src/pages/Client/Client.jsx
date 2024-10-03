import { Box, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { InviteForm } from './InviteForm';
import { ClientInviteSuccessModal } from './ClientInviteSuccessModal';
import usePortalClientData from '../../hooks/usePortalClientData';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import ClientTable from '../../components/table/ClientTable';
import StripeConnect from '../../components/UI/StripeConnect';
import { Spinner, Warning } from '@phosphor-icons/react';
import { useStripeUser } from '../../hooks/useStripeUser';
import { useNavigate } from 'react-router-dom';
import { useSendEmail } from '../../hooks/useEmailApi';

// New WarningBanner component
const WarningBanner = ({ message }) => {
  const navigate = useNavigate()


  const onAction = () => navigate('/settings/portal');
  return (
    <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <Warning className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {message}
            <button
              type="button"
              className="font-medium text-yellow-700 underline hover:text-yellow-600 ml-2"
              onClick={onAction}
            >
              Complete setup
            </button>

          </p>
        </div>
      </div>
    </div>
  )
};

export const Client = () => {
  const { user, currentSelectedPortal } = useSelector((state) => state.auth);
  const { data: portal, isLoading: portalLoading } = usePortalData(currentSelectedPortal);
  const { stripeUser, isLoading: stripeUserLoading, refetch: refetchStripeUser } = useStripeUser(portal?.stripe_connect_account_id);
  const {
    clientData: clients,
    isNotificationOpen,
    toggleNotification,
    loading,
    refetch
  } = usePortalClientData(portal);

  const { sendEmail, loading: sendEmailLoading, error: sendEmailError } = useSendEmail();
  const [temporaryClient, setTemporaryClient] = useState(null);
  const [showStripeConnect, setShowStripeConnect] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

  const isLoading = portalLoading || stripeUserLoading;

  const getStripeStatus = () => {
    if (!portal?.stripe_connect_account_id) return 'not_connected';
    if (stripeUser?.details_submitted && stripeUser?.charges_enabled) return 'verified';
    if (stripeUser?.requirements?.currently_due.length > 0 || stripeUser?.requirements?.past_due.length > 0) return 'incomplete';
    return 'connected'; // Connected but not yet verified or still in progress
  };

  const stripeStatus = getStripeStatus();
  const canAddClients = stripeStatus !== 'not_connected';

  const getWarningMessage = () => {
    switch (stripeStatus) {
      case 'incomplete':
        return "Your Stripe account setup is incomplete. Some features may be limited.";
      case 'connected':
        return "Your Stripe account is awaiting verification. Some features may be limited.";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className='flex items-center justify-center m-36'>
          <Spinner className='animate-spin h-5 w-5' />
        </div>
      </Layout>
    );
  }
  console.log({
    stripeUser
  })
  return (
    <Layout headerName='Clients'>
      {canAddClients ? (
        <>
          {(stripeStatus === 'incomplete' || stripeStatus === 'connected') && (
            <WarningBanner
              message={getWarningMessage()}
              onAction={() => setShowStripeConnect(true)}
            />
          )}
          <Box>
            <div className="px-4 sm:px-6 lg:px-8 pt-7">
              <div className="sm:flex sm:items-center border-b pb-4">
                <div className="sm:flex-auto ">
                  <h1 className="text-base font-semibold leading-6 text-gray-900">Clients</h1>
                  <p className="mt-2 text-sm text-gray-700">
                    A list of all the clients in your portal including their name, email and status.
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
              {
                !loading && clients.length === 0 ? (
                  <div className="mt-8 flex items-center justify-center">
                    <p className="text-sm font-semibold text-gray-700">Your client list is empty. Add a new client to get started!</p>
                  </div>
                ) : <ClientTable refetch={refetch} clients={clients} />
              }

            </div>
          </Box>
          <InviteForm
            isOpen={isOpen}
            onClose={onToggle}
            onToggleSuccess={toggleNotification}
            setTemporaryClient={setTemporaryClient}
          />
          <ClientInviteSuccessModal
            sendEmail={sendEmail}
            client={temporaryClient}
            temporaryClient={temporaryClient}
            isOpen={isNotificationOpen}
            onClose={toggleNotification}
            refetch={refetch}
          />
        </>
      ) : (
        <StripeConnect
          portal={portal}
          stripeUser={stripeUser}
          stripeStatus={stripeStatus}
          refetchStripeUser={refetchStripeUser}
        />
      )}
    </Layout>
  );
};
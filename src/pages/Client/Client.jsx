import React, { useState, useEffect } from 'react';
import { Layout } from '../Dashboard/Layout';
import { InviteForm } from './InviteForm';
import { ClientInviteSuccessModal } from './ClientInviteSuccessModal';
import usePortalClientData from '../../hooks/usePortalClientData';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import ClientTable from '../../components/table/ClientTable';
import { AlertTriangle, FilePlus, Loader } from 'lucide-react';
import { useStripeUser } from '../../hooks/useStripeUser';
import { useNavigate } from 'react-router-dom';
import { useSendEmail } from '../../hooks/useEmailApi';
import PageHeader from '@/components/internal/PageHeader';
import { Button } from '@/components/ui/button';
import EmptyStateFeedback from '@/components/EmptyStateFeedback';

// Your existing getWarningMessage, now able to handle 'incomplete', 'connected', and 'reviewing'
const getWarningMessage = (stripeStatus) => {
  switch (stripeStatus) {
    case 'incomplete':
      return "Your Stripe account setup is incomplete. Some features may be limited.";
    case 'connected':
      return "Your Stripe account is awaiting verification. Some features may be limited.";
    case 'reviewing':
      return "Your Stripe account is awaiting verification. Some features may be limited.";
    default:
      return "";
  }
};

const WarningBanner = ({ message, onAction }) => (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-start">
    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1" aria-hidden="true" />
    <div className="ml-3 flex-1">
      <p className="text-sm text-yellow-700">
        {message}
        <button
          type="button"
          onClick={onAction}
          className="ml-2 underline font-medium focus:outline-yellow-600"
        >
          Complete setup
        </button>
      </p>
    </div>
  </div>
);

export const Client = () => {
  const navigate = useNavigate();
  const { currentSelectedPortal } = useSelector((state) => state.auth);
  const { data: portal, isLoading: portalLoading } = usePortalData(currentSelectedPortal);

  const {
    stripeUser,
    isLoading: stripeUserLoading,
    refetch: refetchStripeUser
  } = useStripeUser(portal?.stripe_connect_account_id);

  const {
    clientData: clients,
    isNotificationOpen,
    toggleNotification,
    loading: clientsLoading,
    refetch: refetchClients
  } = usePortalClientData(portal);

  const { sendEmail } = useSendEmail();
  const [temporaryClient, setTemporaryClient] = useState(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [showStripeConnect, setShowStripeConnect] = useState(false);

  const isLoading = portalLoading || stripeUserLoading;

  // 1) no ID
  // 2) verified
  // 3) reviewing (pending_verification)
  // 4) incomplete (due fields)
  // 5) connected (else)
  const getStripeStatus = () => {
    if (!portal?.stripe_connect_account_id) return 'not_connected';
    if (stripeUser?.details_submitted && stripeUser?.charges_enabled) return 'verified';
    if (
      stripeUser?.details_submitted &&
      stripeUser?.requirements?.disabled_reason === 'requirements.pending_verification'
    ) {
      return 'reviewing';
    }
    if (
      stripeUser?.requirements?.currently_due?.length > 0 ||
      stripeUser?.requirements?.past_due?.length > 0
    ) {
      return 'incomplete';
    }
    return 'connected';
  };

  const stripeStatus = getStripeStatus();
  const canAddClients = stripeStatus === 'verified';
  const bannerMessage = getWarningMessage(stripeStatus);
  const showBanner = Boolean(bannerMessage);

  const toggleInvite = () => setIsInviteOpen((o) => !o);

  if (isLoading) {
    return (
      <Layout hideMobileNav>
        <PageHeader
          title="Clients"
          description="A list of all the clients in your portal including their name, email and status."
        />
        <div className="flex items-center justify-center mt-12">
          <Loader className="h-10 w-10 text-gray-500 animate-spin" />
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerName="Clients" hideMobileNav>
      {showBanner && (
        <WarningBanner
          message={bannerMessage}
          onAction={() => navigate('/settings/portal')}
        />
      )}

      <PageHeader
        title="Clients"
        description="A list of all the clients in your portal including their name, email and status."
        action={
          canAddClients && (
            <Button
              variant="primary"
              onClick={toggleInvite}
              className="bg-black hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add client
            </Button>
          )
        }
      />

      {stripeStatus === 'not_connected' ? (
        <div className="mt-16">
          <EmptyStateFeedback
            IconComponent={AlertTriangle}
            title="Stripe Account Required"
            message="You need to connect your Stripe account to add clients. Please complete the setup in the settings."
            buttonText="Go To Settings"
            onButtonClick={() => navigate('/settings/portal')}
            centered
            buttonIcon={false}
          />
        </div>
      ) : (
        <>
          {clientsLoading ? null : clients.length === 0 ? (
            <div className="mt-16">
              <EmptyStateFeedback
                IconComponent={FilePlus}
                title="Add Your First Client"
                message="It looks like you haven’t added any clients yet. Add a new client to get started!"
                centered
              />
            </div>
          ) : (
            <ClientTable refetch={refetchClients} clients={clients} />
          )}

          <InviteForm
            isOpen={isInviteOpen}
            onClose={toggleInvite}
            onToggleSuccess={toggleNotification}
            setTemporaryClient={setTemporaryClient}
          />

          <ClientInviteSuccessModal
            sendEmail={sendEmail}
            client={temporaryClient}
            temporaryClient={temporaryClient}
            isOpen={isNotificationOpen}
            onClose={toggleNotification}
            refetch={refetchClients}
          />
        </>
      )}

 
    </Layout>
  );
};

export default Client;

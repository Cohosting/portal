import React, { useState, useEffect } from 'react';
import { Layout } from '../Dashboard/Layout';
import { InviteForm } from './InviteForm';
import { ClientInviteSuccessModal } from './ClientInviteSuccessModal';
import usePortalClientData from '../../hooks/usePortalClientData';
import { useSelector } from 'react-redux';
import { usePortalRealtimeData } from '@/hooks/usePortalRealtimeData'; // Import the new realtime hook
import ClientTable from '../../components/table/ClientTable';
import { AlertTriangle, FilePlus, Loader } from 'lucide-react';
import { useStripeUser } from '../../hooks/useStripeUser';
 import { useSendEmail } from '../../hooks/useEmailApi';
import PageHeader from '@/components/internal/PageHeader';
import { Button } from '@/components/ui/button';
import EmptyStateFeedback from '@/components/EmptyStateFeedback';
import ClientSyncStatus from '@/components/ClientSyncStatus';
 
export const Client = () => {
   const { currentSelectedPortal, user } = useSelector((state) => state.auth);
  
  // Use the realtime hook instead of the regular usePortalData
  const { data: portal, isLoading: portalLoading } = usePortalRealtimeData(currentSelectedPortal);
 

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

 
  // Separate loading states - only show initial loading when both portal and stripe are loading
  // Don't show loading just because portal updates in real-time
  const isInitialLoading = portalLoading && stripeUserLoading;

  const getStripeStatus = () => {
    if(!portal?.stripe_connect_account_id && portal?.created_by !== user?.id) return 'not_connected_not_authorized';
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
  
  const toggleInvite = () => setIsInviteOpen((o) => !o);

 // Refetch clients whenever the portal data changes (real-time update)
useEffect(() => {
  if (portal) {
    refetchClients(); // This won't trigger the `clientsLoading` state since it's manually called
  }
}, [portal?.sync_stats]); // Reacts only to portal ID change or real-time updates
 
  // Only show the initial loading screen when we're truly loading for the first time
  if (isInitialLoading || (!portal && portalLoading)) {
    return (
      <Layout hideMobileNav>
        <PageHeader
          title="Clients"
          description="A list of all the clients in your portal including their name, email and status."
        />
        <div className="flex items-center justify-center mt-12">
          <Loader className="h-6 w-6 text-gray-500 animate-spin" />
          <span className="ml-2 text-gray-500">Loading clients...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerName="Clients" hideMobileNav>
      <PageHeader
        title="Clients"
        description="A list of all the clients in your portal including their name, email and status."
        action={
          <Button
            variant="primary"
            onClick={toggleInvite}
            className="bg-black hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add client
          </Button>
        }
      />

      {stripeStatus === 'not_connected_not_authorized' ? (
        <div className="mt-16">
          <EmptyStateFeedback
            IconComponent={AlertTriangle}
            title="Owner Authorization Required"
            message="Only the account owner can connect and authorize the Stripe account. Please contact the owner to complete the setup."
            centered
            buttonIcon={false}
          />
        </div>
      ) : (
        <>
          {/* Show loading state only when clients are actually loading */}
          {clientsLoading ? (
            <div className="flex items-center justify-center mt-12">
              <Loader className="h-6 w-6 text-gray-500 animate-spin" />
              <span className="ml-2 text-gray-500">Loading clients...</span>
            </div>
          ) : clients.length === 0 ? (
            <div className="mt-16">
              <EmptyStateFeedback
                IconComponent={FilePlus}
                title="Add Your First Client"
                message="It looks like you haven't added any clients yet. Add a new client to get started!"
                centered
              />
            </div>
          ) : (
            <div>
              <ClientTable refetch={refetchClients} clients={clients} portal={portal} />
            </div>
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

      <ClientSyncStatus
        syncStats={portal?.sync_stats}
        syncStatus={portal?.sync_status}  
        syncStartedAt={portal?.sync_started_at}
        syncNotificationDismissedAt={portal?.sync_notification_dismissed_at}
        syncCompletedAt={portal?.sync_completed_at}
        syncError={portal?.sync_error}
        portalId={portal?.id}
      />
    </Layout>
  );
};

export default Client;
import React, { useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { InviteForm } from './InviteForm';
import { ClientInviteSuccessModal } from './ClientInviteSuccessModal';
import usePortalClientData from '../../hooks/usePortalClientData';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import ClientTable from '../../components/table/ClientTable';
import StripeConnect from '../../components/internal/StripeConnect';
import { Spinner, Warning } from '@phosphor-icons/react';
import { useStripeUser } from '../../hooks/useStripeUser';
import { useNavigate } from 'react-router-dom';
import { useSendEmail } from '../../hooks/useEmailApi';
import PageHeader from '@/components/internal/PageHeader';
import { Button } from '@/components/ui/button';
import EmptyStateFeedback from '@/components/EmptyStateFeedback';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { FilePlus } from 'lucide-react';

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
  const { currentSelectedPortal } = useSelector((state) => state.auth);
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
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const onToggle = () => setIsOpen(!isOpen);

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
      <Layout hideMobileNav>
            <PageHeader
      title="Clients"
      description="A list of all the clients in your portal including their name, email and status."
 
      />
      <div className="flex items-center justify-center  mt-12">
        <Spinner className="h-10 w-10 text-gray-500 animate-spin" />
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
      </Layout>
    );
  }
 
  return (
    <Layout headerName='Clients' hideMobileNav >
     {(stripeStatus === 'incomplete' || stripeStatus === 'connected') && (
            <WarningBanner
              message={getWarningMessage()}
              onAction={() => setShowStripeConnect(true)}
            />
          )}
    <PageHeader
      title="Clients"
      description="A list of all the clients in your portal including their name, email and status."
      action={

        stripeStatus === 'verified' && (


        <Button 
          variant="primary"
          onClick={onToggle}
          className="bg-black hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add client
        </Button>
        )
      }
      />
      {canAddClients ? (
        <>
         
      
 <div  > 

            {
              !loading && clients.length === 0 ? (
                <div className="mt-16">

                <EmptyStateFeedback
              IconComponent={FilePlus}
              title="Add Your First Client"
              message="It looks like you haven’t added any clients yet.Add a new client to get started!"
              centered
            />
            </div>  
           
              ) : <ClientTable refetch={refetch} clients={clients} />
            }
          </div>
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
        <div className='mt-16'>
        <EmptyStateFeedback
              IconComponent={Warning  }
              title="Stripe Account Required"
              message="You need to connect your Stripe account to add clients. Please complete the setup in the settings."
              buttonText = "Go To Settings"
              onButtonClick={() => navigate('/settings/portal')}
              centered
              buttonIcon={false}
              
            />
        </div>

      )}
    </Layout>
  );
};
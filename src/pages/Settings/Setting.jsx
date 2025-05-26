import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { createStripeConnectAccount } from '../../utils/stripe';
import { useStripeUser } from '../../hooks/useStripeUser';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';

import PageHeader from '@/components/internal/PageHeader';
import SectionHeader from '../../components/SectionHeader';
import InvoicePaymentSettings from '../../components/InvoicePaymentSettings';
import SettingsBillingAddress from '../../components/internal/SettingsBillingAddress.jsx';
import DefaultPortalSettings from '../../components/internal/DefaultPortalSettings.jsx';
import StripeConnectStatus from '../Pricing/components/StripeConnectStatus.jsx';
import { CustomDomainForm } from './CustomDomainForm';
import { DomainConfiguration } from './CheckDomainConfig';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

const ConnectStripeAccount = ({ portal, isLoading, createStripeAccount }) => {
  if (portal && !portal.stripe_connect_account_id) {
    return (
      <>
        <SectionHeader
          hideButton
          heading={"Connect your Stripe Account"}
          description={"Connect your Stripe account to get started with payments."}
        />
        <Button
          variant="default"
          className={`bg-black hover:bg-gray-800 text-white ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={createStripeAccount}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2">Loading...</span>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            </>
          ) : (
            'Connect your account'
          )}
        </Button>
      </>
    );
  }

  return null;
};

const PaymentSettings = ({ settings, updateSetting }) => {
  if (!settings) return null;

  const handleSettingUpdate = (key, value) => {
    console.log('key', key, 'value', value);
    updateSetting({ ...settings, [key]: value });
  };

  return (
    <div>
      <SectionHeader
        hideButton
        heading="Invoice Payment Settings"
        description="Customize your invoice payment settings"
      />
      <InvoicePaymentSettings
        settings={settings}
        handleSettingUpdate={handleSettingUpdate}
      />
    </div>
  );
};

export const Settings = () => {
  const { user, currentSelectedPortal } = useSelector((state) => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { stripeUser, isLoading: stripeUserLoading } = useStripeUser(
    portal?.stripe_connect_account_id
  );
  const [settings, setSettings] = useState(portal?.settings || {});

  const togglePortalSetting = useCallback(
    async (newSettings) => {
      if (!portal) return;

      try {
        setSettings(newSettings);

        const { error } = await supabase
          .from('portals')
          .update({ settings: newSettings })
          .eq('id', portal.id)
          .single();

        if (error) throw error;

        toast.success('Settings updated successfully');
      } catch (err) {
        console.error('Error updating portal setting', err);
      }
    },
    [portal]
  );

  const createStripeAccount = async () => {
    try {
      await createStripeConnectAccount(
        portal.created_by,
        portal.stripe_connect_account_id,
        portal.id,
        setIsLoading
      );
    } catch (err) {
      console.error('Error connecting to Stripe:', err);
      toast.error('Failed to connect to Stripe. Please try again later.');
    }
  };

  useEffect(() => {
    if (portal?.settings) {
      setSettings(portal.settings);
    }
  }, [portal]);

  if (!portal || stripeUserLoading) {
    return (
      <div className="flex items-center justify-center m-4">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }
  console.log('settings', settings);

  return (
    <div className=' pb-14'>
      <PageHeader
        title="Portal Settings"
        description="Manage your portal settings, including branding, subscriptions, and team members."
      />

      <div className="px-6 pt-4 w-[900px] space-y-5 max-w-full ">
        <StripeConnectStatus
          stripeUser={stripeUser}
          isLoading={isLoading}
          portal={portal}
          createStripeAccount={createStripeAccount}
        />

        <ConnectStripeAccount
          portal={portal}
          isLoading={isLoading}
          createStripeAccount={createStripeAccount}
        />

        <div className="mt-4 text-sm sm:text-base">
          <PaymentSettings
            settings={settings}
            updateSetting={togglePortalSetting}
          />
        </div>

        <SettingsBillingAddress
          portalId={portal?.id}
          billingAddress={portal.billing_address}
        />

        <DefaultPortalSettings />
 
        <CustomDomainForm 
          open={open} 
          onOpenChange={setOpen} 
          portalId={portal?.id} 
          initialValues={{
            domain: settings?.domain,
            provider: settings?.provider,
            subdomain: settings?.subdomain,
          }}
        />
       
        <DomainConfiguration
          defaultDomain={portal?.settings?.customDomain}
          setShowUpdate={() => setOpen(true)}
        />
      </div>
    </div>
  );
};
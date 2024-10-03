import React, { useState, useCallback, useEffect } from 'react';
import { createStripeConnectAccount } from '../../utils/stripe';
import { CustomDomainForm } from './CustomDomainForm';
import { CheckDomainConfiguration } from './CheckDomainConfig';
import { useStripeUser } from '../../hooks/useStripeUser';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';
import InvoicePaymentSettings from '../../components/InvoicePaymentSettings';
import SectionHeader from '../../components/SectionHeader';
import { Spinner } from '@phosphor-icons/react';
import StripeConnectStatus from '../Pricing/components/StripeConnectStatus.jsx';
import DefaultPortalSettings from '../../components/UI/DefaultPortalSettings.jsx';
import { toast } from 'react-toastify';


const ConnectStripeAccount = ({ portal, isLoading, createStripeAccount }) => {
  if (portal && !portal.stripe_connect_account_id) {
    return (
      <>
        <p className="mt-4">Connect your stripe to get payouts</p>
        <button
          className={`bg-green-500 text-white mt-3 px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={createStripeAccount}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Connect your account'}
        </button>
      </>
    );
  }
  return null;
};

const PaymentSettings = ({ settings, updateSetting }) => {
  if (!settings) return null;

  return (
    <div>
      <SectionHeader hideButton heading="Invoice Payment Settings" description="Customize your invoice payment settings" />
      <InvoicePaymentSettings
        settings={settings}
        handleSettingUpdate={(key, value) => {
          console.log('key', key, 'value', value)
          updateSetting({
            ...settings,
            [key]: value
          });
        }}
      />
    </div>
  );
};

export const Settings = () => {
  const { user, currentSelectedPortal } = useSelector((state) => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const [isLoading, setIsLoading] = useState(false);
  const { stripeUser, isLoading: stripeUserLoading, error } = useStripeUser(portal?.stripe_connect_account_id);
  const [settings, setSettings] = useState(portal?.settings || {});

  const togglePortalSetting = useCallback(async (settings) => {
    if (!portal) return;

    try {
      const newSettings = {
        ...settings,
      };

      setSettings(newSettings);

      // update postgress in supabase
      const { data, error } = await supabase
        .from('portals')
        .update({
          settings: newSettings,
        })
        .eq('id', portal.id)
        .single();

      toast.success('Settings updated successfully');

      if (error) throw error;

    } catch (err) {
      console.error('Error updating portal setting', err);
    }
  }, [portal, settings]);

  const createStripeAccount = () => {
    createStripeConnectAccount(portal.created_by, portal.stripe_connect_account_id, portal.id, setIsLoading);
  };

  useEffect(() => {
    if (portal && portal.settings) {
      setSettings(portal.settings);
    }
  }, [portal]);

  if (!portal || stripeUserLoading) {
    return (
      <div className='flex items-center justify-center m-4'>
        <Spinner className='animate-spin h-8 w-8' />
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 sm:p-4 pt-4">
        <>
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
          <DefaultPortalSettings />

          {!portal.settings?.customDomain ? <CustomDomainForm /> : <CheckDomainConfiguration defaultDomain={portal?.settings?.customDomain} />}
        </>
      </div>
    </div>
  );
};
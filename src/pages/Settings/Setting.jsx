import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from '../Dashboard/Layout';
import { Box, Button, Checkbox, Flex, Spinner, Text } from '@chakra-ui/react';
import { createStripeConnectAccount } from '../../utils/stripe';
import { CustomDomainForm } from './CustomDomainForm';
import { CheckDomainConfiguration } from './CheckDomainConfig';
import { useStripeUser } from '../../hooks/useStripeUser';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';
import InvoicePaymentSettings from '../../components/InvoicePaymentSettings';
import SectionHeader from '../../components/SectionHeader';

// SettingItem component
const SettingItem = React.memo(({ label, isChecked, onChange }) => (
  <Flex py={1} borderBottom="1px solid #dfe9e6" alignItems="center" justifyContent="space-between">
    <Text fontSize="16px">{label}</Text>
    <Checkbox colorScheme="green" isChecked={isChecked} onChange={onChange} />
  </Flex>
));

// Component for displaying stripe account verification status
const StripeAccountVerification = ({ stripeUser, isLoading, portal, createStripeAccount }) => {
  if (!stripeUser) return null;

  if (stripeUser?.details_submitted && stripeUser?.charges_enabled) {
    return (
      <Box my={3}>
        <Text color="green" fontSize="20px">
          Your account is verified.
        </Text>
        <Button
          bg="green"
          onClick={createStripeAccount}
          color="white"
          mt={3}
        >
          Manage account
        </Button>
      </Box>
    );
  } else if (stripeUser?.requirements?.currently_due.length > 0 || stripeUser?.requirements?.past_due.length > 0) {
    return (
      <Box my={2}>
        <Text color="red.700">
          It seems you still need to submit some information or documents. Please submit those.
        </Text>
        <Button
          isLoading={isLoading}
          onClick={createStripeAccount}
          bg="green"
          color="white"
          mt={3}
        >
          Update your information
        </Button>
      </Box>
    );
  }
  return null;
};

const ConnectStripeAccount = ({ portal, isLoading, createStripeAccount }) => {
  if (portal && !portal.stripe_connect_account_id) {
    return (
      <>
        <Text mt={4}>Connect your stripe to get payouts</Text>
        <Button
          isLoading={isLoading}
          onClick={createStripeAccount}
          bg="green"
          color="white"
          mt={3}
        >
          Connect your account
        </Button>
      </>
    );
  }
  return null;
};

const PaymentSettings = ({ settings, updateSetting }) => {
  if (!settings) return null; // Add a check to ensure settings are available

  return (
    <Box>
      <SectionHeader hideButton heading="Invoice Payment Settings" description="Customize your invoice payment settings" />
      <InvoicePaymentSettings settings={settings} handleSettingUpdate={(key, value) => {
        updateSetting({
          ...settings,
          [key]: value
        });

      }
      } />

    </Box>
  );
};

export const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: portal } = usePortalData(user?.portals);
  const [isLoading, setIsLoading] = useState(false);
  const { stripeUser, isLoading: stripeUserLoading, error } = useStripeUser(portal?.stripe_connect_account_id);
  const [settings, setSettings] = useState(portal?.settings || {});

  const togglePortalSetting = useCallback(async (setting) => {
    if (!portal) return;

    try {
      const newSettings = {
        ...settings,
        [setting]: !settings[setting],
      };
      console.log({ newSettings })

      setSettings(newSettings);

      // update postgress in supabase
      const { data, error } = await supabase
        .from('portals')
        .update({
          settings: newSettings,
        })
        .eq('id', portal.id)
        .single();

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

  // Adjusted spinner logic to show spinner if portal is not loaded or stripeUser is loading.
  if (!portal || stripeUserLoading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p={[2, 4]} pt={4}>
        <h1 className='text-xl font-semibold'>Settings</h1>
        <>
          <StripeAccountVerification
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
          <Box mt={4} fontSize={['15px', '16px']}>
            <PaymentSettings
              settings={settings}
              updateSetting={togglePortalSetting}
            />
          </Box>
          {!portal.settings.customDomain ? <CustomDomainForm /> : <CheckDomainConfiguration defaultDomain={portal.settings.customDomain} />}
        </>
      </Box>
    </Layout>
  );
};

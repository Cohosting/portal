import React, { useContext, useState, useCallback } from 'react';
import { Layout } from '../Dashboard/Layout';
import { Box, Button, Checkbox, Flex, Spinner, Text } from '@chakra-ui/react';
import { createStripeConnectAccount } from '../../utils/stripe';
import { PortalContext } from '../../context/portalContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CustomDomainForm } from './CustomDomainForm';
import { CheckDomainConfiguration } from './CheckDomainConfig';
import { useStripeUser } from '../../hooks/useStripeUser';

// SettingItem component
const SettingItem = React.memo(({ label, isChecked, onChange }) => (
  <Flex py={1} borderBottom="1px solid #dfe9e6" alignItems="center" justifyContent="space-between">
    <Text fontSize="16px">{label}</Text>
    <Checkbox colorScheme="green" isChecked={isChecked} onChange={onChange} />
  </Flex>
));

const StripeAccountVerification = ({ stripeUser, isLoading, portal, createStripeAccount }) => {
  if (!stripeUser) return null;

  if (stripeUser.details_submitted && stripeUser.charges_enabled) {
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
  } else if (stripeUser.requirements.currently_due.length > 0 || stripeUser.requirements.past_due.length > 0) {
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
  if (portal && !portal.stripeConnectAccountId) {
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

const PaymentSettings = ({ portal, updateSetting }) => {
  if (!portal) {
    return <Spinner />;
  }
  return (
    <Box>
      <SettingItem label="Enable ACH Debit payment" isChecked={portal.settings.achDebit} onChange={() => updateSetting('achDebit')} />
      <SettingItem label="Enable Card payment" isChecked={portal.settings.card} onChange={() => updateSetting('card')} />
    </Box>
  );
};

export const Settings = () => {
  const { portal } = useContext(PortalContext);
  const [isLoading, setIsLoading] = useState(false);
  const { stripeUser, isLoading: stripeUserLoading, error } = useStripeUser(portal?.stripeConnectAccountId);

  const togglePortalSetting = useCallback(async (setting) => {
    try {
      const ref = doc(db, 'portals', portal.id);
      await updateDoc(ref, {
        settings: {
          ...portal.settings,
          [setting]: !portal.settings[setting],
        },
      });
    } catch (err) {
      console.error('Error updating portal setting', err);
    }
  }, [portal]);

  const createStripeAccount = () => {
    createStripeConnectAccount(portal.createdBy, portal.stripeConnectAccountId, portal.id, setIsLoading);
  };

  return (
    <Layout>
      <Box p={[2, 4]} pt={4}>
        <Text>Settings</Text>
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
          <Text>Default setting for invoice payment</Text>
          <PaymentSettings
            portal={portal}
            updateSetting={togglePortalSetting}
          />
        </Box>
        {!portal.customDomain ? <CustomDomainForm /> : <CheckDomainConfiguration defaultDomain={portal.customDomain} />}
      </Box>
    </Layout>
  );
};

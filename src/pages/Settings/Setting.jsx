import React, { useContext, useState } from 'react'
import { Layout } from '../Dashboard/Layout'
import { Box, Button, Checkbox, Flex, Spinner, Text } from '@chakra-ui/react';
import { AuthContext } from '../../context/authContext';
import { createStripeConnectAccount } from '../../utils/stripe';
import {
  PortalContext,
  PortalContextProvider,
} from '../../context/portalContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const Settings = () => {
  const { user } = useContext(AuthContext);
  const { portal } = useContext(PortalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');

  const updatePortalSetting = async setting => {
    try {
      const ref = doc(db, 'portals', portal.id);
      await updateDoc(ref, {
        settings: {
          ...portal.settings,
          [setting]: !portal.settings[setting],
        },
      });
    } catch (err) {
      console.log('Error updating portal setting', err);
    }
  };

  return (
    <Layout>
      <Box p={4}>
        <Text>Settings</Text>
        <Text mt={4}>Connect your stripe to get payouts</Text>
        <Button
          isLoading={isLoading}
          onClick={() =>
            createStripeConnectAccount(
              user.uid,
              user.stripeConnectAccountId,
              setIsLoading
            )
          }
          bg={'green'}
          color={'white'}
          mt={3}
        >
          Connect your account
        </Button>

        <Box mt={4}>
          <Text>Default setting for invoice payment</Text>
          {!portal ? (
            <Spinner />
          ) : (
            <Box>
              <Flex
                py={1}
                borderBottom={'1px solid #dfe9e6'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Text fontSize={'17px'}>Enable ACH Debit payment</Text>
                <Checkbox
                  onChange={() => updatePortalSetting('achDebit')}
                  colorScheme="green"
                  isChecked={portal.settings.achDebit}
                />
              </Flex>
              <Flex
                py={1}
                borderBottom={'1px solid #dfe9e6'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Text fontSize={'17px'}>Card</Text>
                <Checkbox
                  colorScheme="green"
                  isChecked={portal.settings.card}
                  onChange={() => updatePortalSetting('card')}
                />
              </Flex>
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

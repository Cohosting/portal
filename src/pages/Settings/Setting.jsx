import React, { useContext, useEffect, useState } from 'react'
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
import { CustomDomainForm } from './CustomDomainForm';
import { CheckDomainConfiguration } from './CheckDomainConfig';

export const Settings = () => {
  const { user } = useContext(AuthContext);
  const { portal } = useContext(PortalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');
  const [stripeUser, setStripeUser] = useState(null)
  const [stripeUserLoding, setStripeUserLoding] = useState(false)

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
  const getStripeUser = async stripeConnectAccountId => {
    if (!stripeConnectAccountId) {
      throw new Error('No stripe connect account id found');
    }
    setStripeUserLoding(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_NODE_URL}/connect/get-connect-user?stripeConnectAccountId=${stripeConnectAccountId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();
      setStripeUser(data.account);
      setStripeUserLoding(false);
    } catch (err) {
      setStripeUserLoding(false);
    }
  };

  useEffect(() => {
    if (!portal) return;
    getStripeUser(portal.stripeConnectAccountId);
  }, [portal]);


  return (
    <Layout>
      <Box  p={[2,4]}  pt={4}>
        <Text>Settings</Text>
        {stripeUser && stripeUser.details_submitted && stripeUser.charges_enabled && (
          <Box my={3}>
            <Text color={'green'} fontSize={'20px'}>
              Your account is verified.

            </Text>
            <Button bg={'green'}

              onClick={() =>
                createStripeConnectAccount(
                  portal.createdBy,
                  portal.stripeConnectAccountId,
                  portal.id,
                  setIsLoading
                )
              }
              color={'white'}
              mt={3}>Manage account</Button>
          </Box>

        )}
        {stripeUser && stripeUser?.requirements.currently_due.length > 0 && stripeUser?.requirements.past_due.length > 0 && (

          <Box my={2}>

            <Text color={'red.700'}>

              It's seems you still need to submit some information or documents.
              please submit those</Text>



            <Button
              isLoading={isLoading}
              onClick={() =>
                createStripeConnectAccount(
                  portal.createdBy,
                  portal.stripeConnectAccountId,
                  portal.id,
                  setIsLoading
                )
              }
              bg={'green'}
              color={'white'}
              mt={3}
            >
              Update you information
            </Button>
          </Box>

        )}
        {
          portal && !portal.stripeConnectAccountId && (
            <>

              <Text mt={4}>Connect your stripe to get payouts</Text>
        <Button
          isLoading={isLoading}
          onClick={() =>
            createStripeConnectAccount(
              portal.createdBy,
              portal.stripeConnectAccountId,
              portal.id,
              setIsLoading
            )
          }
          bg={'green'}
          color={'white'}
          mt={3}
        >
          Connect your account
        </Button>
            </>
          )
        }

        <Box mt={4} fontSize={['15px', '16px']}>
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
                <Text fontSize={'16px'}>Enable ACH Debit payment</Text>
                <Checkbox
                  onChange={() => updatePortalSetting('achDebit')}
                  colorScheme="green"
                  isChecked={portal?.settings.achDebit}
                />
              </Flex>
              <Flex
                py={1}
                borderBottom={'1px solid #dfe9e6'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Text fontSize={'16px'}>Card</Text>
                <Checkbox
                  colorScheme="green"
                  isChecked={portal?.settings.card}
                  onChange={() => updatePortalSetting('card')}
                />
              </Flex>
            </Box>
          )}
        </Box>
        {!portal?.customDomain ? (
          <CustomDomainForm />
        ) : (
          <CheckDomainConfiguration defaultDomain={portal?.customDomain} />
        )}

        <Box mt={4}>
          <Text my={2} color={'green.300'}>
            Setting for importing invoice
          </Text>
          <Flex
            py={1}
            borderBottom={'1px solid #dfe9e6'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'16px'}>Auto-import</Text>
            <Checkbox
              colorScheme="green"
              isChecked={portal?.settings.autoImport}
              onChange={() => updatePortalSetting('autoImport')}
            />
          </Flex>
        </Box>
      </Box>


    </Layout>
  );
};

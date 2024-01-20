import { Box, Button, Spinner, Text } from '@chakra-ui/react'
import React,{ useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext';
import { createStripeConnectAccount } from '../../utils/stripe';
import { PortalContext } from '../../context/portalContext';

export const StripeReturn = () => {
  const [stripeUser, setStripeUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFill, setIsLoadingFill] = useState(false);

  const { portal } = useContext(PortalContext);
  const { user } = useContext(AuthContext);

  const getStripeUser = async stripeConnectAccountId => {
    if (!stripeConnectAccountId) {
      throw new Error('No stripe connect account id found');
    }
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!portal) return;
    getStripeUser(portal.stripeConnectAccountId);
  }, [portal]);

  console.log({
    stripeUser,
  });
  return (
    <Box p={4}>
      <Text fontSize={'40px'}>Let me check your account</Text>

      {isLoading && <Spinner m={'20px'} />}
      {stripeUser && stripeUser.details_submitted && (
        <Text fontSize={'20px'}>
          Your account information submitted successfully
        </Text>
      )}
      {stripeUser && !stripeUser.details_submitted && (
        <Text fontSize={'20px'}>
          Your account information is not submitted successfully
        </Text>
      )}
      {stripeUser && !stripeUser.charges_enabled && (
        <Box fontSize={'20px'} display={'flex'} flexDir={'column'} gap={2}>
          <Text>Your onboarding is not completed</Text>
          {
            stripeUser?.requirements.pending_verification.length > 0 && (
              <>
                <Text color={'red.500'}>Your information is beeing verified! It's  pending! please wait for confirmation</Text>
                <Text></Text>

              </>
            )
          }
          {
            stripeUser?.requirements.currently_due.length > 0 && stripeUser?.requirements.past_due.length > 0 && (
              <Text color={'red.700'}>
                Thanks for submitting your information.
                It's seems you still need to submit some information or documents.
                please submit those</Text>
            )
          }


          <Text>Do you want to fill it!? </Text>
          <Button
            isLoading={isLoadingFill}
            onClick={() =>
              createStripeConnectAccount(
                portal.uid,
                portal.stripeConnectAccountId,
                portal.id,
                setIsLoadingFill
              )
            }
            color={'green'}
          >
            Fill it
          </Button>
        </Box>
      )}
    </Box>
  );
};

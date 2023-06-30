import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';

import { PortalContext } from '../../context/portalContext';
import { useNavigate } from 'react-router-dom';

export const StripeConnectValidation = ({ setShouldShowAddClient }) => {
  const { portal } = useContext(PortalContext);
  const [isLoading, setIsLoading] = useState(true);
  const [stripeUser, setStripeUser] = useState(null);
  const navigate = useNavigate();

  const getStripeUser = async stripeConnectAccountId => {
    if (!stripeConnectAccountId) {
      setIsLoading(false);

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
      const account = data.account;
      setShouldShowAddClient(
        portal.stripeConnectAccountId && account.details_submitted
      );
      setStripeUser(account);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!portal) return;
    getStripeUser(portal.stripeConnectAccountId);
  }, [portal]);
  return (
    <Box p={3} borderBottom={'1px solid #eff1f4'}>
      {isLoading ? (
        <Spinner />
      ) : (
        <Box>
          {portal.stripeConnectAccountId && stripeUser.details_submitted ? (
            <Text>Stripe account connected</Text>
          ) : (
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Box>
                <Text>Stripe account not connected</Text>
                <Text>Connect your stripe account to create clients</Text>
              </Box>
              <Button
                onClick={() => navigate('/settings')}
                size={'sm'}
                fontSize={'14px'}
                color={'white'}
                bg={'black'}
              >
                Settings
              </Button>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};

import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';

export const StripeConnectValidation = ({ setShouldShowAddClient, portal }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stripeUser, setStripeUser] = useState(null);
  const navigate = useNavigate();

  const getStripeUser = async stripeConnectAccountId => {
    if (!stripeConnectAccountId) {
      setIsLoading(false);

      return

/*       throw new Error('No stripe connect account id found');
 */    }
    setIsLoading(true);
    try {

      // axios
      const { data } = await axiosInstance.get(`/stripe/connect/account/${stripeConnectAccountId}`);
      const stripeAccount = data.stripeAccount;
      console.log({ stripeAccount })
      const account = data.account;
      setShouldShowAddClient(
        portal?.stripe_connect_account_id && account.details_submitted
      );
      setStripeUser(account);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!portal) return;
    getStripeUser(portal?.stripe_connect_account_id);
  }, [portal]);
  return (
    <Box p={3} borderBottom={'1px solid #eff1f4'}>
      {isLoading ? (
        <Spinner />
      ) : (
        <Box>
            {portal?.stripe_connect_account_id && stripeUser?.details_submitted ? (
            <Text>Stripe account connected</Text>
          ) : (
            <Flex direction={['column', 'row' ]} alignItems={['flex-start','center']} justifyContent={'space-between'}>
              <Box fontSize={['15px', '16px']}>
                <Text>Stripe account not connected</Text>
                <Text >Connect your stripe account to create clients</Text>
              </Box>
              <Button
                onClick={() => navigate('/settings')}
                size={'sm'}
                mt={2}
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

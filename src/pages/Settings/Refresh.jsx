import { Box, Button, Spinner, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { createStripeConnectAccount } from '../../utils/stripe';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';

export const Refresh = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals)

  const navigate = useNavigate();
  return (
    <Box p={4}>

      {
        !user || !portal ? <Spinner /> : (
          <>
            <Text fontSize={'40px'}>The session may be expired. wanna continue?</Text>

            <Button
              isLoading={isLoading}
              onClick={() =>
                createStripeConnectAccount(
                  portal.createdBy,
                  portal.stripe_connect_account_id,
                  portal.id,
                  setIsLoading
                )
              }
              color={'green'}
            >
              Connect
            </Button>
            <Button ml={3} onClick={() => navigate('/')} variant={'ghost'}>
              Go back to the dashboard
            </Button>
          </>
        )
      }

    </Box>
  );
};

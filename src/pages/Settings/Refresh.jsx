import { Box, Button, Spinner, Text } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { createStripeConnectAccount } from '../../utils/stripe';
import { useNavigate } from 'react-router-dom';
import { PortalContext } from '../../context/portalContext';
import { useSelector } from 'react-redux';

export const Refresh = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(state => state.auth);
  const { portal } = useContext(PortalContext);
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
                  portal.stripeConnectAccountId,
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

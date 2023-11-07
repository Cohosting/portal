import { Box, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { usePlanName } from '../../hooks/usePlanName';
import { prices } from '../../utils/prices';

export const ClientUsageLimit = ({
  portal,
  clients,
  setShouldLimitAddingClient,
}) => {
  const planName = usePlanName(prices, portal?.subscriptions?.current?.priceId);
  const [warningText, setWarningText] = useState('');
  const [subText, setSubText] = useState('');

  useEffect(() => {
    if (!portal || !clients) return;
    if (portal.subscriptionType === 'freemium') {
      if (clients.length >= 10) {
        setShouldLimitAddingClient(true);
      }
      setWarningText(
        'You can only add 10 clients in freemium subscription! Upgrade to use more!'
      );
      setSubText(`Only ${10 - clients.length} clients left!`);
    }

    if (portal.subscriptionType === 'paid') {
      console.log('tuki', planName);
      if (planName === 'Starter' || planName === 'Starter Yearly') {
        if (clients.length >= 100) {
          setShouldLimitAddingClient(true);
        }
        setWarningText(
          'You can only add 100 clients in Starter subscription! Upgrade to use more!'
        );
        setSubText(`Only ${100 - clients.length} clients left!`);
      }
      if (planName === 'Pro' || planName === 'Pro Yearly') {
        if (clients.length >= 2000) {
          setShouldLimitAddingClient(true);
        }
        setWarningText('You can only add 2000 clients in Pro subscription!');
        setSubText(`Only ${2000 - clients.length} clients left!`);
      }
    }
  }, [clients, portal]);
  return (
    <Box p={[2,3]}>
      <Text  color={'red.500'} fontSize={['14px', '16px']} >{warningText}</Text>

      <Box>
        <Text fontSize={['12px', '14px']}>{subText}</Text>
      </Box>
    </Box>
  );
};

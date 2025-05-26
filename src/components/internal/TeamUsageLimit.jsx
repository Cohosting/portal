import React, { useEffect, useState } from 'react';
import { usePlanName } from '../../hooks/usePlanName';
import { prices } from '../../utils/prices';
import { Box, Text } from '@chakra-ui/react';

export const TeamUsageLimit = ({
  portal,
  teamMembers,
  setShouldLimitAddingTeamMembers,
}) => {
  const planName = usePlanName(prices, portal?.subscriptions?.current?.priceId);
  const [warningText, setWarningText] = useState('');

  useEffect(() => {
    if (!portal || !teamMembers || !planName) return;
    if (portal.subscriptionType === 'freemium') {
      setShouldLimitAddingTeamMembers(true);
      return;
    }

    if (portal.subscriptionType === 'paid') {
      if (teamMembers.length >= 5) {
        setWarningText(
          'You used all your team members! You will be charge additional 20$ for each team member!'
        );
        return;
      }

      setWarningText(
        `You have ${
          5 - teamMembers.length
        } team members left! Additional 20$ will be charged for each team member!`
      );
    }
  }, [teamMembers, portal, planName]);
  console.log({
    planName,
  });
  return (
    <Box p={3}>
      <Text fontSize={['14px', '16px']} color={'red.500'}>{warningText}</Text>
    </Box>
  );
};

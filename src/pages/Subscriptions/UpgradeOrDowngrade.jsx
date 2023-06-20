import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { prices } from '../../utils/prices';
import { PortalContext } from '../../context/portalContext';
import { SubscriptionAlert } from './SubscriptionAlert';
import { usePlanName } from '../../hooks/usePlanName';
export const UpgradeOrDowngrade = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { portal } = useContext(PortalContext);
  const planName = usePlanName(prices, portal.priceId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentSelectedPlan, setCurrentSelectedPlan] = useState(null);
  const handleUpdateSubscription = async () => {
    setIsLoading(true);
    try {
      const resonse = await fetch('http://localhost:9000/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: currentSelectedPlan.priceId,
          subscriptionId: portal.subscriptionId,
          isDowngrade:
            currentSelectedPlan.id <
            prices.filter(price => price.priceId === portal.priceId)[0].id,
          portalId: portal.id,
          uid: portal.createdBy,
        }),
      });
      console.log(resonse);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <Box>
      <Box>
        <Text>Monthly billing</Text>
        {prices
          .filter(el => el.type === 'monthly')
          .map(el => (
            <Flex alignItems={'center'} py={2} borderBottom={'1px solid gray'}>
              <Box mx={4}>
                <Text>{el.title}</Text>
                <Text>{el.price}</Text>
              </Box>
              {portal.priceId === el.priceId ? (
                <Box>Current Plan</Box>
              ) : (
                <Button
                  onClick={() => {
                    setCurrentSelectedPlan(el);
                    onOpen();
                  }}
                >
                  {/* decide upgrade or downgrade or current based on index */}
                  {el.id >
                  prices.filter(price => price.priceId === portal.priceId)[0].id
                    ? 'Upgrade'
                    : el.priceId === portal.priceId
                    ? 'Current'
                    : 'Downgrade'}
                </Button>
              )}
            </Flex>
          ))}
      </Box>
      <Box>
        <Text>Yearly billing</Text>
        {prices
          .filter(el => el.type === 'yearly')
          .map(el => (
            <Flex alignItems={'center'} py={2} borderBottom={'1px solid gray'}>
              <Box mx={4}>
                <Text>{el.title}</Text>
                <Text>{el.price}</Text>
              </Box>
              {portal.priceId === el.priceId ? (
                <Box>Current Plan</Box>
              ) : (
                <Button
                  onClick={() => {
                    setCurrentSelectedPlan(el);
                    onOpen();
                  }}
                >
                  {/* decide upgrade or downgrade or current based on index */}
                  {el.id >
                  prices.filter(price => price.priceId === portal.priceId)[0].id
                    ? 'Upgrade'
                    : el.priceId === portal.priceId
                    ? 'Current'
                    : 'Downgrade'}
                </Button>
              )}
            </Flex>
          ))}
      </Box>

      <SubscriptionAlert
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={onClose}
        plan={planName}
        nextPlan={usePlanName(prices, currentSelectedPlan?.priceId)}
        onUpdate={handleUpdateSubscription}
      />
    </Box>
  );
};

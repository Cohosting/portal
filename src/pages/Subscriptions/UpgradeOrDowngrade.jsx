import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { prices } from '../../utils/prices';
import { SubscriptionAlert } from './SubscriptionAlert';
import { usePlanName } from '../../hooks/usePlanName';
import useAsyncLoading from '../../hooks/useAsyncFunc';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
export const UpgradeOrDowngrade = () => {
  const { isLoading: isSubscriptionCancel, runAsyncFunction: runSubscriptionCancel } = useAsyncLoading();
  const { isLoading: isReactivateLoading, runAsyncFunction: runReactivateAsync } = useAsyncLoading();



  const [isCancelLoading, setIsCancelLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(state => state.auth)
  const { data: portal } = usePortalData(user.portals)
  const planName = usePlanName(prices, portal?.subscriptions?.current?.priceId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentSelectedPlan, setCurrentSelectedPlan] = useState(null);
  const handleUpdateSubscription = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_NODE_URL}/update-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: currentSelectedPlan.priceId,
            subscriptionId: portal.subscriptions.current.subscriptionId,
            addOnSubscriptionId: portal.addOnSubscription.subscriptionId,
            isDowngrade:
              currentSelectedPlan.id <
              prices.filter(
                price =>
                  price.priceId === portal?.subscriptions?.current?.priceId
              )[0].id,
            portalId: portal.id,
            uid: portal.createdBy,
          }),
        }
      );
      console.log(res);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleCancelDowngrade = async () => {
    setIsCancelLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_NODE_URL}/cancel-downgrade`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentSubscriptionId: portal.subscriptions.current.subscriptionId,
            portalId: portal.id,
            futureSubscriptionId: portal.subscriptions.future.subscriptionId,
            addOnSubscriptionId: portal.addOnSubscription.subscriptionId,
          }),
        }
      );
      console.log(res);
      setIsCancelLoading(false);
    } catch (error) {
      setIsCancelLoading(false);
      console.log(error);
    }
  };
  const handleCancel = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_NODE_URL}/cancel-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId: portal.subscriptions.current.subscriptionId,
            portalId: portal.id,
            addOnSubscriptionId: portal.addOnSubscription.subscriptionId,
          }),
        }
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReactivate = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_NODE_URL}/reactivate-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId: portal.subscriptions.current.subscriptionId,
            portalId: portal.id,
            addOnSubscriptionId: portal.addOnSubscription.subscriptionId,
          }),
        }
      );
      console.log(res);
    } catch (error) {
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
              <Box mx={4}>
                {
                  !(portal?.subscriptions?.future && el.priceId === portal?.subscriptions?.future.priceId) && (
                    <>
                      {portal?.subscriptions?.current?.priceId === el.priceId ? (
                        <Box>
                          <Text>Current plan</Text>
                          {
                            portal?.subscriptions?.current?.subscriptionEnd ? (
                              <Box>
                                <Text>Subscription is schedule to get cancelled at: {new Date(portal?.subscriptions?.current?.subscriptionEnd * 1000).toDateString()}</Text>
                                <Button isLoading={isReactivateLoading} onClick={() => runReactivateAsync(handleReactivate)}>Reactivate</Button>

                              </                              Box>
                            ) : (
                              <Button isLoading={isSubscriptionCancel} onClick={() => runSubscriptionCancel(handleCancel)}>Cancel</Button>

                            )
                          }
                        </Box>
              ) : (
                <>

                {
                                     !portal?.subscriptions?.current?.subscriptionEnd && (
<Button
                  onClick={() => {
                    setCurrentSelectedPlan(el);
                    onOpen();
                  }}
                >
                  {/* decide upgrade or downgrade or current based on index */}
                  {el.id >
                  prices.filter(
                    price =>
                      price.priceId === portal?.subscriptions?.current?.priceId
                  )[0].id
                    ? 'Upgrade'
                    : el.priceId === portal?.subscriptions?.current?.priceId
                    ? 'Current'
                    : 'Downgrade'}
                </Button>

                                     )

                }
                                                     </>

                
              )}

                    </>
                  )
                }
              </Box>
              {
                portal?.subscriptions?.future && el.priceId === portal?.subscriptions?.future.priceId && (
                  <Box>
                    <Text>You have downgraded to this plan</Text>
                    <Text>This will start at: {new Date(portal?.subscriptions?.future?.subscriptionStart * 1000).toDateString()}</Text>

                    <Button isLoading={isCancelLoading} onClick={handleCancelDowngrade}>Cancel downgrade</Button>

                  </Box>
                )
              }
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
              {portal?.subscriptions?.current?.priceId === el.priceId ? (
                <Box>Current Plan</Box>
              ) : (

                <>
                  {
                    !portal?.subscriptions?.current?.subscriptionEnd && (
                      <Button
                      onClick={() => {
                        setCurrentSelectedPlan(el);
                        onOpen();
                      }}
                    >
                      {/* decide upgrade or downgrade or current based on index */}
                      {el.id >
                      prices.filter(
                        price =>
                          price.priceId === portal?.subscriptions?.current?.priceId
                      )[0].id
                        ? 'Upgrade'
                        : el.priceId === portal?.subscriptions?.current?.priceId
                        ? 'Current'
                        : 'Downgrade'}
                    </Button>
                    )

                    

                  }
                </>
               
              )}
                            {
                portal?.subscriptions?.future && el.priceId === portal?.subscriptions?.future.priceId && (
                  <Box>
                    <Text>You have downgraded to this plan</Text>
                    <Text>This will start at: {new Date(portal?.subscriptions?.future?.subscriptionStart * 1000).toDateString()}</Text>

                    <Button isLoading={isCancelLoading} onClick={handleCancelDowngrade}>Cancel downgrade</Button>

                  </Box>
                )
              }
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

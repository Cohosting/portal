import React, { useContext, useEffect, useState } from 'react';
import { Layout } from '../Dashboard/Layout';
import { Box, Button, Checkbox, Divider, Flex, Text } from '@chakra-ui/react';
import { prices } from '../../utils/prices';
import { UpgradeOrDowngrade } from './UpgradeOrDowngrade';
import SubscriptionPage from './SubscriptionPage';
import { unixToDateString } from '../../utils';
import PaymentMethodList from '../../components/PaymentMethodLists';
import CurrentPlan from './CurrentPlan';
import AddonsComponent from './AddonsComponent';
import SubscriptionPaymentError from '../../components/SubscriptionPaymentError';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
const PricingItem = ({
  title,
  price,
  features,
  priceId,
  email,
  portalId,
  user,
  onSelect,
  type,
  isSubscriptionLoading,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Box
      ml={3}
      bg={'white'}
      p={4}
      borderRadius={'4px'}
      boxShadow={'0px 0px 24px rgba(0, 0, 0, 0.07)'}
    >
      <Text fontSize={'18px'} fontWeight={'bold'} mb={4}>
        {title}
      </Text>
      <Text fontSize={'24px'} fontWeight={'bold'} mb={4}>
        {type === 'monthly' ? price : `$${Number(price.split('$')[1]) / 12}`} /
        month
      </Text>
      <Divider mb={4} />
      <Box>
        {features.map((feature, index) => (
          <Flex key={index} alignItems={'center'} mb={2}>
            <Box bg={'#EFF1F4'} borderRadius={'4px'} p={1} mr={2}>
              <Text fontSize={'12px'} fontWeight={'bold'} color={'#6B6F76'}>
                {index + 1}
              </Text>
            </Box>
            <Text fontSize={'14px'} fontWeight={'bold'} color={'#6B6F76'}>
              {feature}
            </Text>
          </Flex>
        ))}
      </Box>
      <Button
        onClick={async () => {

          setIsLoading(true)
          try {

            await onSelect()
          } catch (err) {
            console.log(err)
          }

          setIsLoading(false)

        }}
        isLoading={isLoading}
        mt={4}
        width={'100%'}
        color={'#fff'}
        height={'3rem'}
        borderRadius={'4px'}
        background={'#212B36'}
        boxShadow={'0px 1px 2px rgba(0, 0, 0, 0.07)'}
        _hover={{ background: '#27333F' }}
      >
        Select
      </Button>
    </Box>
  );
};

export const Pricing = () => {
  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals)
  const [selectedPeriod, setSelectedPeriod] = useState('monthly'); // ['monthly', 'yearly'
  const [priceId, setPriceId] = useState();
  const [isPoweredBy, setIsPoweredBy] = useState(false);
  const [showUpgradeDowngrade, setShowUpgradeDowngrade] = useState(false);
  const [isBrandRemoved, setIsBrandRemoved] = useState(false);
  const [isBrandingPaymentElementOpen, setIsBrandingPaymentElementOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const [isBrandingCancel, setIsBrandingCancel] = useState(false);

  const handleAddOnSubscription = async () => {
    setIsBrandRemoved(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_NODE_URL}/createAddOnSubscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            portalId: portal.id,
            removeBranding: true,
            numberOfTeamMembers: 0,
          }),
        }
      );
      setIsBrandRemoved(false);
      console.log(await response.json());
    } catch (err) {
      setIsBrandRemoved(false);

      console.log(err.message);
    }
  };
  const handleSubscription = async price => {
    setIsSubscriptionLoading(true);

    const res = await fetch(
      `${process.env.REACT_APP_NODE_URL}/checkDefaultPaymentMethod/${portal.customerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const { hasDefaultPaymentMethod } = await res.json();
    if (!hasDefaultPaymentMethod) {
      setPriceId(price.priceId);
    } else {
      const response = await fetch(
        `${process.env.REACT_APP_NODE_URL}/create-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: portal.customerId,
            priceId: price.priceId,
            portalId: portal.id,
            uid: user.uid,
          }),
        }
      );
      const data = await response.json();

      console.log('subscription is implemented', data);
    }

    setIsSubscriptionLoading(false);
  };

  const handleIsBrandingPaymentElementOpen = async () => {
    setIsLoading(true);
    const res = await fetch(
      `${process.env.REACT_APP_NODE_URL}/checkDefaultPaymentMethod/${portal.customerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const { hasDefaultPaymentMethod } = await res.json();
    console.log({ hasDefaultPaymentMethod });
    if (!hasDefaultPaymentMethod) {
      setIsBrandingPaymentElementOpen(true);
    } else {
      handleAddOnSubscription();
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (!portal) return;
    (async () => {
      // fetch from /payment-method using javascript fetch
      const res = await fetch(
        `${process.env.REACT_APP_NODE_URL}/payment-method`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: portal?.customerId,
          }),
        }
      );
      const { cardType, last4Digits } = await res.json();
      setCardDetails({ cardType, last4Digits });
    })();
  }, [portal]);

  const handleBrandingRemoveCancel = async () => {
    setIsBrandingCancel(true);

    try {
      // use PUT method on /subscriptions/items
      const response = await fetch(
        `${process.env.REACT_APP_NODE_URL}/subscriptions/items`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            portalId: portal.id,
            subscriptionId: portal.addOnSubscription.subscriptionId,
            itemId: portal.addOnSubscription.items.removeBranding.itemId,
          }),
        }
      );
      setIsBrandingCancel(false);
      console.log(await response.json());
    } catch (err) {
      setIsBrandingCancel(false);

      console.log(err.message);
    }
  };

  async function createBillingPortalSession(customerId) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_NODE_URL}/create-billing-portal-session/${customerId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Error creating Billing Portal session');
      }
      const { url } = await response.json();
      // Redirect the user to the session URL
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      // Handle the error appropriately
    }
  };

  console.log(priceId)

  let currentPortal = portal?.id
  return (
    <Layout>
      <Box fontSize={['15px','16px']}>
      {priceId || isBrandingPaymentElementOpen ? (
        <Box px={['15px','25px']}>
          <SubscriptionPage
            isBrandingPaymentElementOpen={isBrandingPaymentElementOpen}
            priceId={priceId}
            isPoweredBy={isPoweredBy}
          />
        </Box>
      ) : (
        <Box px={['15px','25px']}>


              {portal?.subscriptions?.current?.subscriptionStatus ? (
            <Box
              bg={'white'}
              p={4}
              borderRadius={'4px'}
              boxShadow={'0px 0px 24px rgba(0, 0, 0, 0.07)'}
            >
                  <SubscriptionPaymentError errorCode={'insufficient_funds'} errorDetails={portal?.payment_error} />

              <Text fontSize={['16px','18px']} fontWeight={'bold'} mb={4}>
                You are already subscribed to{' '}
                {
                  prices.filter(
                    el => el.priceId === portal.subscriptions?.current?.priceId
                  )[0].title
                }{' '}
                plan
              </Text>
                  {/*               {portal.payment_error && (
                <Text  fontSize={['16px','18px']} fontWeight={'bold'} mb={4}>
                  There is a error processing your payment:
                  {JSON.stringify(portal.payment_error)}
                </Text>
                  )}   */}

                  <CurrentPlan />

                  <PaymentMethodList />
                  {/*         <Text fontSize={'14px'} fontWeight={'bold'} color={'#6B6F76'}>
                You can change your plan from your dashboard
              </Text> */}

              {portal.subscriptions && portal.subscriptions.future && (
                <Box>
                  <Text  fontSize={['16px','18px']} fontWeight={'bold'} color={'red'}>
                    You have a plan change scheduled for{' '}
                    {unixToDateString(
                      portal.subscriptions.future.subscriptionStart
                    )}
                    plan
                  </Text>
                </Box>
              )}
              <Divider my={4} />

                  {/*    <Box>
                <Text  fontSize={['16px','18px']} fontWeight={'bold'} mb={4}>
                  Add-ons
                </Text>
                {portal?.addOnSubscription?.items['removeBranding']?.active ? (
                  <Flex
                    p={2}
                    borderRadius={'6px'}
                    border={'1px solid gray'}
                    flexDir={'column'}
                    alignItems={'space-between'}
                    justifyContent={'center'}
                  >
                    <Text fontWeight={'700'}  fontSize={['18px','24px']}>
                      You are subscribed to remove branding for 100$/mo
                    </Text>
                    {!portal.addOnSubscription?.items['removeBranding']
                      ?.will_expire ? (
                      <>
                        <Text>Wanna cancel??</Text>
                        <Button
                          w={'min-content'}
                          onClick={() => handleBrandingRemoveCancel()}
                          isLoading={isBrandingCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Box>
                        <Text>
                          Your subscription will expire on:{' '}
                          {new Date(
                            portal.addOnSubscription?.items['removeBranding']
                              ?.will_expire * 1000
                          ).toUTCString()}
                        </Text>
                        <Text>You can again can subscribe after that!</Text>
                      </Box>
                    )}
                  </Flex>
                ) : (
                  <Flex alignItems={'center'} justifyContent={'space-between'}>
                    <Text fontWeight={'700'}>
                      Remove copilot branding for 100$
                    </Text>
                    <Button
                      onClick={handleAddOnSubscription}
                      isLoading={isBrandRemoved}
                      size={['sm', 'md']}
                      p={3}
                    >
                      Subscribe
                    </Button>
                  </Flex>
                )}
              </Box> */}

                  <AddonsComponent
                    isSubscribed={portal?.addOnSubscription?.items['removeBranding']?.active}
                    expirationDate={portal.addOnSubscription?.items['removeBranding']
                      ?.will_expire}
                  />



                  {/*       <Text my={2}>Manage your subscription</Text>
              <Box>
                <Text>Do you wanna upgrade or downgrade subscription? </Text>
                <Button
                  onClick={() => setShowUpgradeDowngrade(!showUpgradeDowngrade)}
                >
                  Procceed
                </Button>
                {showUpgradeDowngrade && (
                  <UpgradeOrDowngrade
                    currentPriceId={portal?.subscriptions?.current?.priceId}
                  />
                )}
              </Box> */}
            </Box>
          ) : (
            <>
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                mb={4}
              >
                <Text fontSize={'24px'} fontWeight={'bold'}>
                  Pricing
                </Text>
                <Text fontSize={'14px'} fontWeight={'bold'} color={'#6B6F76'}>
                  3 plans
                </Text>
              </Flex>
              <Flex my={3}>
                <Button
                  border={selectedPeriod === 'monthly' && '3px solid gray'}
                  onClick={() => setSelectedPeriod('monthly')}
                  fontSize={'15px'}
                  bg={'black'}
                  color={'white'}
                >
                  Monthly
                </Button>
                <Button
                  border={selectedPeriod === 'yearly' && '3px solid gray'}
                  onClick={() => setSelectedPeriod('yearly')}
                  fontSize={'15px'}
                  bg={'black'}
                  color={'white'}
                  ml={2}
                >
                  Yearly
                </Button>
              </Flex>
              <Flex alignItems={'flex-start'} mb={4}>
                {prices
                  .filter(el => el.type === selectedPeriod)
                  .map((price, index) => (
                    <PricingItem
                      user={user}
                      portalId={currentPortal}
                      email={user.email}
                      key={index}
                      title={price.title}
                      price={price.price}
                      features={price.features}
                      priceId={price.priceId}
                      onSelect={async () => handleSubscription(price)}
                      isSubscriptionLoading={isSubscriptionLoading && price.priceId === priceId}
                      type={price.type}
                    />
                  ))}
              </Flex>
              <Box>
                {

                }
    
              </Box>
            </>
          )}
        </Box>
      )}
      </Box>
 
    </Layout>
  );
};

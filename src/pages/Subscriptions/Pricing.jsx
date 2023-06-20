import React, { useContext, useState } from 'react'
import { Layout } from '../Dashboard/Layout'
import { Box, Button, Checkbox, Divider, Flex, Text } from '@chakra-ui/react';
import { prices } from '../../utils/prices';
import { AuthContext } from '../../context/authContext';
import { PortalContext } from '../../context/portalContext';
import { UpgradeOrDowngrade } from './UpgradeOrDowngrade';
import SubscriptionPage from './SubscriptionPage';
import { unixToDateString } from '../../utils';
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
}) => {
  const [isPoweredBy, setIsPoweredBy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateCheckoutSession = async () => {
    setIsLoading(true);

    const response = await fetch(
      'http://localhost:9000/create-subscription-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          email,
          portalId: portalId,
          uid: user.uid,
          isPoweredBy,
        }),
      }
    );
    const { session } = await response.json();
    window.location.href = session.url;
    setIsLoading(false);
  };

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
        onClick={() => onSelect(isPoweredBy)}
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
  const { user } = useContext(AuthContext);
  const { currentPortal, portal } = useContext(PortalContext);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly'); // ['monthly', 'yearly'
  const [priceId, setPriceId] = useState();
  const [isPoweredBy, setIsPoweredBy] = useState(false);
  const [showUpgradeDowngrade, setShowUpgradeDowngrade] = useState(false);
  const [isBrandRemoved, setIsBrandRemoved] = useState(false);
  // Data reference
  /*  const { portalId, removeBranding, numberOfTeamMembers } = req.body;
   */

  const handleAddOnSubscription = async () => {
    setIsBrandRemoved(true);

    try {
      const response = await fetch(
        'http://localhost:9000/createAddOnSubscription',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            portalId: portal.id,
            removeBranding: true,
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
  console.log(portal);
  return (
    <Layout>
      {priceId ? (
        <Box px={'25px'}>
          <SubscriptionPage priceId={priceId} isPoweredBy={isPoweredBy} />
        </Box>
      ) : (
        <Box px={'25px'}>
          {portal?.subscriptionStatus === 'active' ? (
            <Box
              bg={'white'}
              p={4}
              borderRadius={'4px'}
              boxShadow={'0px 0px 24px rgba(0, 0, 0, 0.07)'}
            >
              <Text fontSize={'18px'} fontWeight={'bold'} mb={4}>
                You are already subscribed to{' '}
                {prices.filter(el => el.priceId === portal.priceId)[0].title}{' '}
                plan
              </Text>
              <Text fontSize={'14px'} fontWeight={'bold'} color={'#6B6F76'}>
                You can change your plan from your dashboard
              </Text>

              {portal.subscriptions && portal.subscriptions.future && (
                <Box>
                  <Text fontSize={'18px'} fontWeight={'bold'} color={'red'}>
                    You have a plan change scheduled for{' '}
                    {unixToDateString(
                      portal.subscriptions.future.subscriptionStart
                    )}
                    plan
                  </Text>
                </Box>
              )}
              <Divider my={4} />
              <Box>
                <Text fontSize={'18px'} fontWeight={'bold'} mb={4}>
                  Add-ons
                </Text>

                <Flex alignItems={'center'} justifyContent={'space-between'}>
                  <Text fontWeight={'700'}>
                    Remove copilot branding for 100$
                  </Text>
                  <Button
                    onClick={handleAddOnSubscription}
                    isLoading={isBrandRemoved}
                  >
                    Subscribe
                  </Button>
                </Flex>
              </Box>

              <Text my={2}>Manage your subscription</Text>
              <Box>
                <Text>Do you wanna upgrade or downgrade subscription? </Text>
                <Button
                  onClick={() => setShowUpgradeDowngrade(!showUpgradeDowngrade)}
                >
                  Procceed
                </Button>
                {showUpgradeDowngrade && (
                  <UpgradeOrDowngrade currentPriceId={portal.priceId} />
                )}
              </Box>
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
                      onSelect={poweredBy => {
                        setPriceId(price.priceId);
                        setIsPoweredBy(poweredBy);
                      }}
                      type={price.type}
                    />
                  ))}
              </Flex>
            </>
          )}
        </Box>
      )}
    </Layout>
  );
};


/* 

[
  {
    id: 'il_1NGKhkG6ekPTMWCwCW2cQ0KG',
    object: 'line_item',
    amount: 8900,
    amount_excluding_tax: 8900,
    currency: 'usd',
    description: '1 × Portal HQ (at $89.00 / month)',
    discount_amounts: [],
    discountable: true,
    discounts: [],
    livemode: false,
    metadata: {
      portalId: 'mryw1DKDVYmotmKufpko',
      uid: 't8wtAnCk1ERpA0arHcXmz9KOKU02'
    },
    period: { end: 1688729948, start: 1686137948 },
    plan: {
      id: 'price_1NGIMkG6ekPTMWCwswlQQmkS',
      object: 'plan',
      active: true,
      aggregate_usage: null,
      amount: 8900,
      amount_decimal: '8900',
      billing_scheme: 'per_unit',
      created: 1686128958,
      currency: 'usd',
      interval: 'month',
      interval_count: 1,
      livemode: false,
      metadata: {},
      nickname: null,
      product: 'prod_NqlWkOR3IRpfea',
      tiers_mode: null,
      transform_usage: null,
      trial_period_days: null,
      usage_type: 'licensed'
    },
    price: {
      id: 'price_1NGIMkG6ekPTMWCwswlQQmkS',
      object: 'price',
      active: true,
      billing_scheme: 'per_unit',
      created: 1686128958,
      currency: 'usd',
      custom_unit_amount: null,
      livemode: false,
      lookup_key: null,
      metadata: {},
      nickname: null,
      product: 'prod_NqlWkOR3IRpfea',
      recurring: [Object],
      tax_behavior: 'unspecified',
      tiers_mode: null,
      transform_quantity: null,
      type: 'recurring',
      unit_amount: 8900,
      unit_amount_decimal: '8900'
    },
    proration: false,
    proration_details: { credited_items: null },
    quantity: 1,
    subscription: 'sub_1NGKhkG6ekPTMWCwcuPKPS0J',
    subscription_item: 'si_O2PWPg5zoUvLat',
    tax_amounts: [],
    tax_rates: [],
    type: 'subscription',
    unit_amount_excluding_tax: '8900'
  },
  {
    id: 'il_1NGKhkG6ekPTMWCwBIhBjko7',
    object: 'line_item',
    amount: 10000,
    amount_excluding_tax: 10000,
    currency: 'usd',
    description: '1 × Portal HQ (at $100.00 / month)',
    discount_amounts: [],
    discountable: true,
    discounts: [],
    livemode: false,
    metadata: {
      portalId: 'mryw1DKDVYmotmKufpko',
      uid: 't8wtAnCk1ERpA0arHcXmz9KOKU02'
    },
    period: { end: 1688729948, start: 1686137948 },
    plan: {
      id: 'price_1N53z2G6ekPTMWCwGfVS7xDn',
      object: 'plan',
      active: true,
      aggregate_usage: null,
      amount: 10000,
      amount_decimal: '10000',
      billing_scheme: 'per_unit',
      created: 1683452064,
      currency: 'usd',
      interval: 'month',
      interval_count: 1,
      livemode: false,
      metadata: {},
      nickname: null,
      product: 'prod_NqlWkOR3IRpfea',
      tiers_mode: null,
      transform_usage: null,
      trial_period_days: null,
      usage_type: 'licensed'
    },
    price: {
      id: 'price_1N53z2G6ekPTMWCwGfVS7xDn',
      object: 'price',
      active: true,
      billing_scheme: 'per_unit',
      created: 1683452064,
      currency: 'usd',
      custom_unit_amount: null,
      livemode: false,
      lookup_key: null,
      metadata: {},
      nickname: null,
      product: 'prod_NqlWkOR3IRpfea',
      recurring: [Object],
      tax_behavior: 'unspecified',
      tiers_mode: null,
      transform_quantity: null,
      type: 'recurring',
      unit_amount: 10000,
      unit_amount_decimal: '10000'
    },
    proration: false,
    proration_details: { credited_items: null },
    quantity: 1,
    subscription: 'sub_1NGKhkG6ekPTMWCwcuPKPS0J',
    subscription_item: 'si_O2PWrog1iB23zh',
    tax_amounts: [],
    tax_rates: [],
    type: 'subscription',
    unit_amount_excluding_tax: '10000'
  }
]
*/
import React, { useContext, useState } from 'react';
import {
    Box,
    Flex,
    Text,
    Stack,
    Button,
    useMediaQuery,
    useDisclosure,
} from '@chakra-ui/react';
import { prices } from '../../utils/prices';
import { SubscriptionAlert } from './SubscriptionAlert';
import { usePlanName } from '../../hooks/usePlanName';
import { useCancel, useCancelDowngrade, useReactivate, useUpdateSubscription } from '../../hooks/useSubscription';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';


function CurrentPlan() {
    const [isDesktop, setIsDesktop] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useSelector(state => state.auth)
    const { data: portal } = usePortalData(user.portals)
    const [currentSelectedPlan, setCurrentSelectedPlan] = useState(null);

    const planName = usePlanName(prices, portal?.subscriptions?.current?.priceId);
    // Use a dedicated breakpoint for 375px screens
    const [isMobile375Query] = useMediaQuery('(max-width: 500px)');
    const { isLoading, error, updateSubscription } = useUpdateSubscription(portal);
    const { isLoading: isCancelLoading, cancel } = useCancel(portal);
    const { isLoading: isReactiviting, reactivate } = useReactivate(portal);
    const { isLoading: isCancelDowngrade, cancelDowngrade } = useCancelDowngrade(portal);



    React.useEffect(() => {
        setIsDesktop(!isMobile375Query);
    }, [isMobile375Query]);

    const isDowngraded = (el) => {
        return portal?.subscriptions?.future && el.priceId === portal?.subscriptions?.future.priceId
    }

    const getButtonText = (price) => {

        const activePriceIdStripe = portal?.subscriptions?.current?.priceId;
        const activePriceId = prices.filter((el) => el.priceId === activePriceIdStripe)[0].id;


        if (price.id > activePriceId) {
            return 'Upgrade';
        } else if (price.id < activePriceId) {
            return 'Downgrade';
        } else {
            return 'Active';
        }
    };

    function formatTimestamp(timestamp) {
        // Create a Date object from the timestamp
        const date = new Date(timestamp * 1000); // Multiply by 1000 for milliseconds

        // Extract month, day, and year using appropriate methods
        const month = date.toLocaleString('en-US', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();

        // Format the date string
        return `${month} ${day} ${year}`;
    }


    return (
        <Box bgColor="gray.100" p={4} borderRadius="lg">
            <Text fontSize="lg" fontWeight="bold">Plan info</Text>

            {isDesktop && (
                <Box flex={1} p={4}>

                    <Box mt={4}>
                        {prices.map((plan) => (
                            <Flex
                                key={plan.title}
                                justifyContent="space-between"
                                alignItems="center"
                                p={2}
                                borderBottom="1px solid gray.200"
                                cursor="pointer"
                                _hover={{
                                    bgColor: 'gray.200',
                                }}
                            >
                                <Text fontSize="md">{plan.title}</Text>
                                <Stack alignItems={'center'}>
                                    {
                                        plan.features.map((feature) => <Text fontSize="sm">{feature}</Text>)
                                    }
                                </Stack>
                                {getButtonText(plan) === 'Active' ? (

                                    <Box>
                                        <Text fontSize="sm" color="green.500">
                                            YOUR PLAN
                                        </Text>
                                        {
                                            portal?.subscriptions?.current?.subscriptionEnd ? (
                                                <Flex flexDir={'column'} alignItems={'center'}>

                                                    <Button isLoading={isReactiviting} size="sm" variant="outline" my={2} onClick={reactivate} >Reactivate</Button>
                                                    <Box fontSize={'14px'} color={'red.500'}>
                                                        <Text>Expired in:</Text>
                                                        <Text>{formatTimestamp(portal?.subscriptions?.current?.subscriptionEnd)}</Text>
                                                    </Box>

                                                </Flex>
                                            ) : (
                                                <Button isLoading={isCancelLoading} size="sm" variant="outline" my={2} onClick={cancel} >Cancel</Button>
                                            )
                                        }

                                    </Box>

                                ) : isDowngraded(plan) ? (
                                    <Flex flexDir={'column'} alignItems={'center'}>
                                        <Button isLoading={isCancelDowngrade} onClick={cancelDowngrade} size="sm" variant="outline" my={2}>Cancel <br /> Downgrade</Button>
                                        <Box fontSize={'14px'} color={'green.500'} >
                                            <Text>Will start:</Text>
                                            <Text>{formatTimestamp(portal?.subscriptions?.future?.subscriptionStart)}</Text>
                                        </Box>

                                    </Flex>
                                ) : !portal?.subscriptions?.current?.subscriptionEnd ? (
                                    <Button onClick={() => {
                                        onOpen();
                                        setCurrentSelectedPlan(plan)
                                    }} size="sm" variant="outline">
                                        {getButtonText(plan)}
                                    </Button>
                                ) : <Box w={'140px'} />}


                            </Flex>


                        ))}

                    </Box>
                </Box>
            )
            }

            {
                !isDesktop && (
                    <>
                        {/*               <Button onClick={onOpen} variant="ghost">
                        {!isOpen ? 'Plan details' : 'Close'}
                    </Button>
                    {isOpen && ( */}
                        <Stack spacing={4} mt={4}>
                            {prices.map((plan) => (
                                <Flex flexDir={'column'} py={1} _notLast={{
                                    borderBottom: '1px solid',
                                    borderColor: 'gray.400'
                                }} key={plan.title} alignItems="center">
                                    <Box>
                                        <Flex flexDir={'column'}>
                                            <Text fontSize="md">{plan.title}</Text>
                                            <Stack >
                                                {
                                                    plan.features.map((feature) => <Text fontSize="sm">{feature}</Text>)
                                                }
                                            </Stack>
                                        </Flex>

                                        {plan.price && (
                                            <Text ml="auto" fontSize="sm">
                                                {plan.price}
                                            </Text>
                                        )}

                                    </Box>
                                    {getButtonText(plan) === 'Active' ? (
                                        <Box>
                                            <Text fontSize="sm" color="green.500">
                                                YOUR PLAN
                                            </Text>
                                            {
                                                portal?.subscriptions?.current?.subscriptionEnd ? (
                                                    <Flex flexDir={'column'} alignItems={'center'}>

                                                        <Button isLoading={isReactiviting} size="sm" variant="outline" my={2} onClick={reactivate} >Reactivate</Button>
                                                        <Box fontSize={'14px'} color={'red.500'}>
                                                            <Text>Expired in:</Text>
                                                            <Text> 01/2024</Text>
                                                        </Box>

                                                    </Flex>
                                                ) : (
                                                    <Button isLoading={isCancelLoading} size="sm" variant="outline" my={2} onClick={cancel} >Cancel</Button>
                                                )
                                            }

                                        </Box>

                                    ) : isDowngraded(plan) ? (
                                        <Flex flexDir={'column'} alignItems={'center'}>
                                            <Button isLoading={isCancelDowngrade} onClick={cancelDowngrade} size="sm" variant="outline" my={2}>Cancel <br /> Downgrade</Button>
                                            <Box fontSize={'14px'} color={'green.500'} >
                                                <Text>Will start:</Text>
                                                <Text> 01/2024</Text>
                                            </Box>

                                        </Flex>
                                    ) : (
                                        <Button onClick={() => {
                                            onOpen();
                                            setCurrentSelectedPlan(plan)
                                        }} size="sm" variant="outline">
                                            {getButtonText(plan)}
                                        </Button>
                                    )}
                                </Flex>
                            ))}
                            {/*      {price[0].isCurrent && (
                            <Text color="gray.500">You are currently on the {plans[0].name} plan.</Text>
                        )} */}
                            <Button size="sm" variant="outline">
                                Manage Plan
                            </Button>
                        </Stack>
                        {/*   )} */}
                    </>
                )
            }

            <SubscriptionAlert
                isLoading={isLoading}
                isOpen={isOpen}
                onClose={onClose}
                plan={planName}
                nextPlan={usePlanName(prices, currentSelectedPlan?.priceId)}
                onUpdate={() => updateSubscription({
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
                })}
            />
        </Box >
    );
}

export default CurrentPlan;

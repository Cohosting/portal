import React, { useContext, useState } from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    Container,
    Center,
    Flex,
    VStack,
    Divider,
    useColorModeValue,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';

const AddonsComponent = ({ isSubscribed, expirationDate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const textColor = useColorModeValue('gray.700', 'white');
    const { user } = useSelector(state => state.auth)
    const { data: portal } = usePortalData(user.portals)
    const handleSubscribe = async () => {
        setIsLoading(true);

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
            setIsLoading(false);
            console.log(await response.json());
        } catch (err) {
            setIsLoading(false);

            console.log(err.message);
        }
    };

    const handleCancel = async () => {
        setIsLoading(true);

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
            setIsLoading(false);
            console.log(await response.json());
        } catch (err) {
            setIsLoading(false);

            console.log(err.message);
        }
    };

    return (
        <Container maxW={'2xl'} p={4} rounded="lg" bg={useColorModeValue('white', 'gray.800')}>
            <Flex flexDir={'column'}>
                <Heading as="h2" size="md" textAlign="left" color={textColor}>
                    Remove Branding
                </Heading>
                <Text fontSize="sm" color={textColor}>
                    Enhance your experience by removing branding for ${100}/mo.
                </Text>
            </Flex>
            <Divider my={4} />
            {isSubscribed ? (
                <VStack spacing={4} alignItems="center">
                    <Heading as="h3" size="sm" textAlign="center" color={textColor}>
                        You are subscribed to remove branding.
                    </Heading>

                    {
                        expirationDate && (
                            <Text textAlign={'center'} fontSize="sm" color={textColor}>
                                Your subscription will expire on: {new Date(expirationDate * 1000).toUTCString()}
                                <br />
                                You can again can subscribe after that!

                            </Text> 
                        )
                    }
                    {/*         <Text textAlign={'center'} fontSize="sm" color={textColor}>
                        Your subscription will expire on: {new Date(expirationDate * 1000).toUTCString()}
                        <br />
                        You can again can subscribe after that!

                    </Text> */}
                    {
                        !expirationDate && (
                            <Button isLoading={isLoading} onClick={handleCancel} colorScheme="red">
                                Cancel Subscription
                            </Button>
                        )
                    }

                </VStack>
            ) : (
                <Flex justifyContent="center">
                    <Button isLoading={isLoading} onClick={handleSubscribe} variant="solid" size="lg" colorScheme="teal">
                        Subscribe for ${100}/mo
                    </Button>
                </Flex>
            )}
        </Container>
    );
};

export default AddonsComponent;

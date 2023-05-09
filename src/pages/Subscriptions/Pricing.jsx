import React, { useContext, useState } from 'react'
import { Layout } from '../Dashboard/Layout'
import { Box, Button, Divider, Flex, Text } from '@chakra-ui/react';
import { prices } from '../../utils/prices';
import { AuthContext } from '../../context/authContext';


const PricingItem = ({title, price, features, priceId, email}) => {

  const [isLoading, setIsLoading] = useState(false);
 const handleCreateCheckoutSession = async () => {
  setIsLoading(true);
 
    const response = await fetch("http://localhost:9000/create-subscription-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId: priceId,
        email
      }),
    });
    const {session} = await response.json();
    window.location.href = session.url;
    setIsLoading(false);
  };


  
    return (

        <Box ml={3} bg={'white'} p={4} borderRadius={'4px'} boxShadow={'0px 0px 24px rgba(0, 0, 0, 0.07)'} >
            <Text fontSize={'18px'} fontWeight={'bold'} mb={4}>
                {title}
            </Text>
            <Text fontSize={'24px'} fontWeight={'bold'} mb={4}>
                {price}
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
            <Button onClick={handleCreateCheckoutSession} isLoading={isLoading} mt={4} width={'100%'} color={'#fff'} height={'3rem'} borderRadius={'4px'} background={'#212B36'} boxShadow={'0px 1px 2px rgba(0, 0, 0, 0.07)'} _hover={{ background: '#27333F' }}>
                Get started
            </Button>
        </Box>
    )
}

export const Pricing = () => {
  const { user } = useContext(AuthContext)
  return (
    <Layout>
      {
        user.subscriptionStatus === 'active' ? (
          <Box bg={'white'} p={4} borderRadius={'4px'} boxShadow={'0px 0px 24px rgba(0, 0, 0, 0.07)'} >
            <Text fontSize={'18px'} fontWeight={'bold'} mb={4}>
              You are already subscribed to {user.subscriptionId} plan
            </Text>
            <Text fontSize={'14px'} fontWeight={'bold'} color={'#6B6F76'}>
              You can change your plan from your dashboard
            </Text> 
          </Box>
        ) : (
          <>
                  <Flex justifyContent={'space-between'} alignItems={'center'} mb={4}>  
            <Text fontSize={'24px'} fontWeight={'bold'}>
                Pricing
            </Text>
            <Text fontSize={'14px'} fontWeight={'bold'} color={'#6B6F76'}>
                3 plans
            </Text>
        </Flex>
        <Flex  alignItems={'flex-start'} mb={4}>
            {
              prices.map((price, index) => (
                <PricingItem email={user.email} key={index} title={price.title} price={price.price} features={price.features} priceId={price.priceId} />
              ))  
            }
        </Flex>
          </>
        )
      }
      

       
    </Layout>
  )
}

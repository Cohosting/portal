import { Box, Button, Spinner, Text } from '@chakra-ui/react'
import React,{ useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext';
import { createStripeConnectAccount } from '../../utils/stripe';

export const StripeReturn = () => {
    const [stripeUser, setStripeUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingFill, setIsLoadingFill] = useState(false);


    const { user } = useContext(AuthContext);


    const getStripeUser = async (uid) => {
        if(!user.stripeConnectAccountId) {
            throw new Error('No stripe connect account id found')

        }
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:9000/get-connect-user?stripeConnectAccountId=${user.stripeConnectAccountId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                
                
            });
            const data = await res.json();
            setStripeUser(data.account);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

        }
    }
    
    useEffect(() => {
        if(!user) return;
        getStripeUser(user.uid)
    }, [user])

    console.log({
        
        stripeUser   
    })
  return (
     <Box p={4}>
         <Text fontSize={'40px'}>
            Let me check your account
        </Text>

        {
            isLoading && <Spinner  m={'20px'} />
        }
        {
           stripeUser && stripeUser.details_submitted && <Text fontSize={'20px'}>Your account information submitted successfully</Text>
        }
        {
           stripeUser &&!stripeUser.details_submitted && <Text fontSize={'20px'}>Your account information is not submitted successfully</Text>
        }
                {
           stripeUser && !stripeUser.charges_enabled &&  (
            <Box>
                <Text>Your onboarding is not completed</Text>
                <Text>Do you want to fill it!? </Text>
                <Button isLoading={isLoadingFill} onClick={() => createStripeConnectAccount
                    (user.uid, user.stripeConnectAccountId, setIsLoadingFill)} color={'green'} >Fill it</Button>
            </Box>

           )
        }

    
     </Box>
  )
}

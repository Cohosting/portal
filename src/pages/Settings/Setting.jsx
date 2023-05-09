import React, { useContext, useState } from 'react'
import { Layout } from '../Dashboard/Layout'
import { Button, Text } from '@chakra-ui/react'
import { AuthContext } from '../../context/authContext';
import { createStripeConnectAccount } from '../../utils/stripe';

export const Settings = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');
  


  return (
    <Layout>
      <Text>Settings</Text>
      <Text mt={4} >Connect your stripe to get payouts</Text>
      <Button  isLoading={isLoading}  onClick={ () => createStripeConnectAccount(user.uid, user.stripeConnectAccountId, setIsLoading)} bg={'green'} color={'white'} mt={3}>Connect your account</Button>
    </Layout>
  )
}

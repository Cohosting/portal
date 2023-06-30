import {
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Input,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { signInWithEmailAndPassword } from '../../../lib/Client/auth';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../lib/firebase';
import { ClientAuthContext } from '../../../context/clientAuthContext';
import { useNavigate } from 'react-router-dom';
import { ClientPortalContext } from '../../../context/clientPortalContext';

export const ClientLogin = () => {
  const navigate = useNavigate();
  const { clientPortal } = useContext(ClientPortalContext);
  const [isError, setIsError] = useState(null);
  const { setSessionToken } = useContext(ClientAuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clientLoginCredentials, setClientLoginCredentials] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      onOpen();
      const { email, password } = clientLoginCredentials;
      const signInWithEmailAndPassword = httpsCallable(
        functions,
        'signInWithEmailAndPassword'
      );
      const res = await signInWithEmailAndPassword({
        email,
        password,
        portalId: clientPortal.id,
      });
      if (res.data.success) {
        setSessionToken(res.data.token);
        navigate('/portal');
        onClose();
        console.log(res);
      } else {
        onClose();
        setIsError('Email or password incorrect');
      }

      console.log(res);

    } catch (error) {
      console.log(`Error logging in: ${error}`);
    }
  };

  return (
    <Flex
      flexDir={'column'}
      height={'100vh'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Flex
        width={'100%'}
        maxW={'1000px'}
        height={'600px'}
        pl={5}
        boxShadow={'0px 0px 60px rgba(0, 0, 0, 0.12)'}
      >
        <Box flex={1} padding={'56px 60px 24px 60px'}>
          <Flex
            alignItems={'center'}
            justifyContent={'center'}
            mt={'30px'}
            mb={'40px'}
          >
            {clientPortal?.brandSettings?.squareIcon ? (
              <Image
                src={clientPortal?.brandSettings?.squareIcon}
                alt={'logo'}
                borderRadius={'6px'}
              />
            ) : (
              <Image
                src={'https://via.placeholder.com/50'}
                alt={'logo'}
                width={'50px'}
                height={'50px'}
                borderRadius={'6px'}
              />
            )}
          </Flex>
          <Box>
            <Box>
              <Text mb={1}>Email</Text>
              <Input
                name="email"
                onChange={e => {
                  setClientLoginCredentials({
                    ...clientLoginCredentials,
                    [e.target.name]: e.target.value,
                  });
                }}
                value={clientLoginCredentials.email}
              />
            </Box>
            <Box my={3}>
              <Text mb={1}>Password</Text>
              <Input
                name="password"
                value={clientLoginCredentials.password}
                onChange={e => {
                  setClientLoginCredentials({
                    ...clientLoginCredentials,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
            </Box>
          </Box>
          {isError && (
            <Text color={'red'} fontSize={'14px'}>
              {isError}
            </Text>
          )}
          <Button
            variant={'outline'}
            width={'100%'}
            isLoading={isOpen}
            onClick={handleLogin}
            mt={'15px'}
          >
            Login
          </Button>

          <Box mt={'50px'}>
            <Divider my={5} />
            <Text textAlign={'right'} fontSize={'13px'}>
              Forgot password
            </Text>
          </Box>
        </Box>

        <Box flex={1} w={'100%'}>
          <Image
            objectFit={'cover'}
            src={
              clientPortal?.brandSettings?.squareLoginImage ||
              'https://images.unsplash.com/photo-1685058160554-17a165ad47da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
            }
            alt={'login image'}
            width={'100%'}
            height={'100%'}
          />
        </Box>
      </Flex>
      {clientPortal?.brandSettings?.poweredByCopilot && (
        <Text mt={'20px'} textAlign={'center'}>
          Powered by Copilot
        </Text>
      )}
    </Flex>
  );
};

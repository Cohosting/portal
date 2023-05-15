import { Box, Button, Input, Text, useDisclosure } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { signInWithEmailAndPassword } from '../../../lib/Client/auth';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../lib/firebase';
import { ClientAuthContext } from '../../../context/clientAuthContext';
import { useNavigate } from 'react-router-dom';

export const ClientLogin = () => {
  const navigate = useNavigate();
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
      });
      if (res.data.success) {
        setSessionToken(res.data.token);
      }
      onClose();
      navigate('/portal');
    } catch (error) {
      console.log(`Error logging in: ${error}`);
    }
  };

  return (
    <Box px={5}>
      Client Login
      <Box>
        <Box>
          <Text>Email</Text>
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
        <Box>
          <Text>Password</Text>
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
      <Button isLoading={isOpen} onClick={handleLogin}>
        Login
      </Button>
    </Box>
  );
};

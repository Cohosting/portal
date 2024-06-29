import { Box, Button, FormLabel, Text } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';

import { CustomInput } from '../../components/CustomInput';
import { AuthBox, Layout } from './Layout';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { handleFirebaseError } from '../../utils/firebase';
import { getOrCreateUser } from '../../lib/auth';
import { AuthContext } from '../../context/authContext';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userCredentials, setUserCredentials] = useState({ email: '', password: '' });
  const { setUser, setIsAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate();

  // Validates if the input fields are not empty
  const isInputValid = (name) => userCredentials[name] !== '';

  // Handles input change and updates state
  const handleChange = (e, name) => {
    setUserCredentials({ ...userCredentials, [name]: e.target.value });
  };

  // Handles the login process
  const handleEmailPasswordLogin = async () => {
    const { email, password } = userCredentials;
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getOrCreateUser(user);
      setUser(userData);
      setIsAuthenticated(true);
      navigate('/'); // Redirect to home page
    } catch (error) {
      handleFirebaseError(error.code, setError);
    } finally {
      setIsLoading(false);
    }
  };

  // Checks if the email and password inputs are valid for enabling the Sign in button
  const isSignInDisabled = () => {
    const { email, password } = userCredentials;
    return !email || !email.includes('@') || !password;
  };


  return (
    <>
      {true ? (
        <Layout>
          <AuthBox>
            <CustomInput
              label={'Work email'}
              name={'email'}
              value={userCredentials.email}
              handleChange={handleChange}
              isInvalid={() => !isInputValid('email')}
              type={'text'}
            />
            <CustomInput
              label={'Work email'}
              name={'password'}
              formLabel={
                <FormLabel
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  m="0"
                  fontSize={'13px'}
                >
                  <Text as="span">Password</Text>
                  <Text as="span" color={'#6B6F76'} m="0">
                    Forgot password?
                  </Text>
                </FormLabel>
              }
              value={userCredentials.password}
              handleChange={handleChange}
              isInvalid={() => !isInputValid('email')}
              type={'password'}
            />
            {error && (
              <Text color={'red'} fontSize={'13px'} mt={'1rem'}>
                {error}
              </Text>
            )}
            <Button
              isLoading={isLoading}
              isDisabled={isSignInDisabled()}
              onClick={handleEmailPasswordLogin}
              width={'100%'}
              color={'#fff'}
              marginTop={'2.3rem'}
              height={'3rem'}
              borderRadius={'4px'}
              background={'#212B36'}
              boxShadow={'0px 1px 2px rgba(0, 0, 0, 0.07)'}

              _hover={{ background: '#27333F' }}
            >
              Sign in
            </Button>
          </AuthBox>
          <Box
            maxW={'340px'}
            mt={'1rem'}
            textAlign={'center'}
            fontSize={'14px'}
          >
            <Text
              mt="1rem"
              onClick={() => navigate('/signup')}
              cursor={'pointer'}
            >
              New to copilot?
            </Text>
          </Box>
        </Layout>
      ) : (
        <Box></Box>
      )}
    </>
  );
};

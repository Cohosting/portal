import { Box, Button, FormLabel, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { CustomInput } from '../../components/CustomInput';
import { AuthBox, Layout } from './Layout';
import { useNavigate } from 'react-router-dom';
import { useSubdomain } from '../../hooks/useSubdomain';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export const LoginForm = () => {
  const d = useSubdomain();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const handleError = name => {
    let isError = true;
    isError = userCredentials[name] === '' ? true : false;

    return isError;
  };

  const handleChange = (e, name) => {
    handleError('email');
    setUserCredentials({
      ...userCredentials,
      [name]: e.target.value,
    });
  };

  const handleEmailPasswordLogin = async () => {
    const { email, password } = userCredentials;
    if (email === '' || password === '') {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
     window.location.href = '/';
    } catch (error) {
      console.log(error);
      setError(error.message);
      setIsLoading(false);
    }
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
              isInvalid={() => handleError('email')}
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
              isInvalid={() => handleError('password')}
              type={'password'}
            />
            {error && (
              <Text color={'red'} fontSize={'13px'} mt={'1rem'}>
                {error}
              </Text>
            )}
            <Button
              isLoading={isLoading}
              width={'100%'}
              color={'#fff'}
              isDisabled={
                userCredentials.email === '' ||
                !userCredentials.email.includes('@') ||
                userCredentials.password === ''
              }
              marginTop={'2.3rem'}
              height={'3rem'}
              borderRadius={'4px'}
              background={'#212B36'}
              boxShadow={'0px 1px 2px rgba(0, 0, 0, 0.07)'}
              onClick={() => {
                handleEmailPasswordLogin();
                // userCredentials.email !== '' &&
                //   userCredentials.password !== '' &&
                //   setStep(step + 1);
                // setIsLoading(step === 1 ? false : true);
              }}
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

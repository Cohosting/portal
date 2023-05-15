import { Box, Button, FormLabel, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

import { CustomInput } from '../../components/CustomInput';
import { AuthBox, Layout } from './Layout';
import { useNavigate } from 'react-router-dom';
import { useSubdomain } from '../../hooks/useSubdomain';

export const LoginForm = () => {
  const d = useSubdomain();
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
            <Button
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

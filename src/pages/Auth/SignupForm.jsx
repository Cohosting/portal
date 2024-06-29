import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../../hooks/useSignup';
import { CustomInput } from '../../components/CustomInput';

const SignupForm = ({ isLargerThan450 }) => {
    const navigate = useNavigate();
    const { handleChange, signup, email, password, error, isLoading } = useSignup();

    return (
        <Box>

            <Flex sx={{ flexDirection: 'column', boxShadow: '0px 0px 24px rgba(0, 0, 0, 0.07)', padding: '24px 28px 28px 40px', border: '1px solid #EFF1F4', minWidth: isLargerThan450 ? '460px' : '100%' }}>
                <CustomInput
                    name={'email'}
                    value={email}
                    type="email"
                    errorMessage={'Email'}
                    handleChange={handleChange}
                    label={'Work email'}
                />
                <CustomInput
                    name={'password'}
                    value={password}
                    type="password"
                    errorMessage={'Password'}
                    handleChange={handleChange}
                    label={'Set a password'}
                />
                {error && <Text color={'red'}>{error}</Text>}
                <Button
                    width={'100%'}
                    color={'#fff'}
                    isLoading={isLoading}
                    marginTop={'2.3rem'}
                    height={'3rem'}
                    borderRadius={'4px'}
                    background={'#212B36'}
                    onClick={async () => {
                        await signup();
                    }}
                    boxShadow={'0px 1px 2px rgba(0, 0, 0, 0.07)'}
                    _hover={{ background: '#27333F' }}
                >
                    Create an account
                </Button>
            </Flex>
            <Box maxW={'340px'} mt={'1rem'} textAlign={'center'} fontSize={'14px'}>
                <Text>
                    You acknowledge that you read, and agree to our{' '}
                    <Text as="a" href="#terms-of-service" color={'#6B6F76'} _hover={{ textDecoration: 'underline' }}>
                        Terms of Service
                    </Text>{' '}
                    and our{' '}
                    <Text as="a" href="#privacy-policy" color={'#6B6F76'} _hover={{ textDecoration: 'underline' }}>
                        Privacy Policy.
                    </Text>
                </Text>
                <Text mt="1rem" onClick={() => navigate('/login')} cursor={'pointer'}>
                    Already have an account?
                </Text>
            </Box>

        </Box>


    );
};

export default SignupForm;

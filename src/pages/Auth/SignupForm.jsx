import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../../hooks/useSignup';
import { supabase } from '../../lib/supabase';
import { Layout } from './Layout';
import Header from '../../components/Header';
import InputField from '../../components/InputField';

const SignupForm = ({ isLargerThan450 }) => {
    const navigate = useNavigate();
    const { handleChange, signup, email, password, error, isLoading } = useSignup();

    return (


        <Box>
            <Layout>
                <Header title="Create a new account" />
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                    <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">

                        <InputField
                            value={email}
                            id="email"
                            name="email"
                            type="email"
                            handleChange={handleChange}
                            label="Email address"
                            errorMessage="Not a valid email address."
                            ariaInvalid={false}
                            required
                        />
                        <div className="mt-6 mb-8">
                            <InputField
                                value={password}
                                id="password"
                                name="password"
                                type="password"
                                label="Password"
                                handleChange={handleChange}

                                ariaInvalid={false}
                                required
                            />
                        </div>
                        {
                            error && <p id="email-error" className="my-2 mb-4 text-sm text-red-600">
                                {error}
                            </p>
                        }


                        <div>
                            <button
                                onClick={signup}
                                type="submit"
                                className="btn-indigo"
                            >
                                {
                                    isLoading ? 'Loading...' : 'Sign in'
                                }

                            </button>
                            <button className='flex m-auto	' onClick={() => navigate('/login')}>
                                <div className="flex justify-center mt-6">
                                    <span className="text-sm text-gray-500">Don't have an account?</span>
                                    <span className="text-sm text-indigo-600 ml-1">Sign up</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>

            {/*             <Flex sx={{ flexDirection: 'column', boxShadow: '0px 0px 24px rgba(0, 0, 0, 0.07)', padding: '24px 28px 28px 40px', border: '1px solid #EFF1F4', minWidth: isLargerThan450 ? '460px' : '100%' }}>
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
                        signup()



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
 */}
        </Box>


    );
};

export default SignupForm;

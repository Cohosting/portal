import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
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
                <button onClick={async () => await supabase.auth.signOut()}>
                    signout
                </button>
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
                                className="btn-indigo w-full"
                            >
                                {
                                    isLoading ? 'Loading...' : 'Sign up'
                                }

                            </button>
                            <button className='flex m-auto	' onClick={() => navigate('/login')}>
                                <div className="flex justify-center mt-6">
                                    <span className="text-sm text-gray-500">Already have a account?</span>
                                    <span className="text-sm text-indigo-600 ml-1">Log in</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>

        </Box>


    );
};

export default SignupForm;

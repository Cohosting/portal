import { Box, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

import { Layout } from './Layout';
import { useNavigate } from 'react-router-dom';
import { handleSupabaseError } from '../../utils/firebase';
import { getOrCreateUser } from '../../lib/auth';
import { useSelector } from 'react-redux';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import { supabase } from '../../lib/supabase';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from '../../store/slices/authSlice';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userCredentials, setUserCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    console.log({
      email,
      password,
    })

    setIsLoading(true);
    try {
      const { data: {
        user
      }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log(error)
        throw error;
      }

      dispatch(setIsAuthenticated(true))
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.log(error)
      handleSupabaseError(error, setError);
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

        <Layout>
        <Header title="Sign in to your account" />
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <InputField
              value={userCredentials.email}
              id="email"
              name="email"
              type="email"
              handleChange={(e) => handleChange(e, 'email')}
              label="Email address"
              errorMessage="Not a valid email address."
              required
            />  
            <div className="mt-6 mb-8">

              <InputField
              value={userCredentials.password}
                id="password"
                name="password"
                type="password"
                handleChange={(e) => handleChange(e, 'password')}
                label="Password"
                errorMessage="Password is required."
                required

            />
            </div>
            {error && (
              <Text color={'red'} fontSize={'13px'} mb={'1.2rem'}>
                {error}
              </Text>
            )}
            <button
              onClick={handleEmailPasswordLogin}
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {
                isLoading ? 'Loading...' : 'Log in'
              }

            </button>

          <Box
            maxW={'340px'}
              m="auto"
              mt={'1rem'}

              textAlign={'center'}
            fontSize={'14px'}
          >
              <p
                className='text-sm text-gray-500 cursor-pointer'

                onClick={() => navigate('/signup')}
            >
              New to copilot?
              </p>
          </Box>
          </div>
        </div>

        </Layout>

    </>
  );
};

import {
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Input,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientPortalContext } from '../../../context/clientPortalContext';
import { useClientAuth } from '../../../hooks/useClientAuth';
import InputField from '../../../components/InputField';

export const ClientLogin = ({
  portalId
}) => {
  const { clientPortal } = useContext(ClientPortalContext);
  const [clientLoginCredentials, setClientLoginCredentials] = useState({
    email: '',
    password: '',
  }); const [isLessThen660] = useMediaQuery('(min-width: 660px)')
  const { authenticate, authenticationError, isLoading } = useClientAuth(portalId)

  const { email, password } = clientLoginCredentials;

  const handleLogin = (e) => {
    e.preventDefault()
    authenticate(email, password, portalId);
  }
  return (

    <div className="flex  h-screen flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="h-10 w-auto"
            />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>

          </div>

          <div className="mt-10">
            <div>
              <form onSubmit={handleLogin} className="space-y-6">

                <InputField
                  id="email"
                  name="email"
                  type="email"
                  label="Email address"
                  value={email}
                  handleChange={(e) => setClientLoginCredentials({ ...clientLoginCredentials, email: e.target.value })}
                  errorMessage="Not a valid email address."
                  ariaInvalid={false}
                  required
                />

                <div className="mt-6 mb-8">
                  <InputField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    value={password}
                    handleChange={(e) => setClientLoginCredentials({ ...clientLoginCredentials, password: e.target.value })}
                    ariaInvalid={false}
                    required
                  />
                </div>

                {/* <p id="email-error" className="mt-2 text-sm text-red-600">
                  Not a valid email address.
                </p> */}
                {
                  authenticationError && (<p id="email-error" className="mt-2 text-sm text-red-600">
                    Not a valid email address.
                  </p>)

                }

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm leading-6">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {isLoading ? 'Loading...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>


          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
    /*     <Flex
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
                    maxHeight={'120px'}
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
              {authenticationError && (
                <Text color={'red'} fontSize={'14px'}>
                  {authenticationError}
                </Text>
              )}
              <Button
                variant={'outline'}
                width={'100%'}
                isLoading={isOpen}
                onClick={() => authenticate(email, password, portalId)}
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
    
            {
              isLessThen660  &&  (
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
              )
            }
    
        
          </Flex>
          {clientPortal?.brandSettings?.poweredByCopilot && (
            <Text mt={'20px'} textAlign={'center'}>
              Powered by Copilot
            </Text>
          )}
        </Flex> */
  );
};


import React, { useState } from 'react';
import { useClientAuth } from '../../../hooks/useClientAuth';
import InputField from '../../../components/InputField';
import { useDomainInfo } from '../../../hooks/useDomainInfo';
import { useClientPortalData } from '../../../hooks/react-query/usePortalData';

export const ClientLogin = ({
  portal
}) => {
  const [clientLoginCredentials, setClientLoginCredentials] = useState({
    email: '',
    password: '',
  });
  const { authenticate, authenticationError, isLoading } = useClientAuth(portal.id);


  const { brand_settings } = portal

  const { email, password } = clientLoginCredentials;

  const handleLogin = (e) => {
    e.preventDefault()
    authenticate(email, password, portal.id);
  }
  return (

    <div className="flex  h-screen flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              alt="Your Company"
              src={brand_settings.fullLogo || "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"}
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
          src={brand_settings?.squareLoginImage || "https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>

  );
};

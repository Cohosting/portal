
import React, { useState } from 'react';
import { useClientAuth } from '../../../hooks/useClientAuth';
import InputField from '../../../components/InputField';
import { useDomainInfo } from '../../../hooks/useDomainInfo';
import { useClientPortalData } from '../../../hooks/react-query/usePortalData';
import { darken } from 'polished';

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

  let {
    sidebarBgColor,
    sidebarTextColor = 'rgb(79, 70, 229)',
    accentColor = 'rgb(79, 70, 229)',
    sidebarActiveTextColor,

  } = portal?.brand_settings || {};

  sidebarTextColor = darken(0.4, sidebarTextColor);

  const handleLogin = (e) => {
    e.preventDefault()
    authenticate(email, password, portal.id);
  }
  return (
    <div className="flex h-screen flex-1" style={{
      backgroundColor: sidebarBgColor,
    }}>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              alt="Your Company"
              src={brand_settings?.fullLogo || "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"}
              className="h-10 w-auto"
            />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight" style={{ color: sidebarTextColor }}>
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
                  handleChange={(e) => setClientLoginCredentials({ ...clientLoginCredentials, email: e.target.value.trim() })}
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

                {authenticationError && (
                  <p id="email-error" className="mt-2 text-sm" style={{ color: 'red' }}>
                    {authenticationError}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      style={{ accentColor }}
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm leading-6" style={{ color: sidebarTextColor }}>
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm leading-6">
                    <a href="#" className="font-semibold" style={{ color: accentColor }}>
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm"
                    style={{
                      backgroundColor: accentColor,
                      color: sidebarActiveTextColor,
                    }}
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

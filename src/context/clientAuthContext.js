import { httpsCallable } from 'firebase/functions';
import { createContext, useEffect, useState } from 'react';
import { functions } from '../lib/firebase';

export const ClientAuthContext = createContext();

export const ClientAuthContextComponent = ({ children }) => {
  const [clientUser, setClientUser] = useState();
  useEffect(() => {
    const storedToken = localStorage.getItem('sessionToken');
    if (storedToken) {
      // Verify the stored token on the server-side and set the user state accordingly
      verifyStoredToken(storedToken);
    }
  }, []);

  const verifyStoredToken = async token => {
    try {
      // Send an API request to the server to verify the token and retrieve user data
      const verifyToken = httpsCallable(functions, 'verifyToken');
      const response = await verifyToken({
        token,
      });

      console.log({ response });
      if (response.data.success) {
        const { user } = response.data;
        setClientUser(user);
      } else {
        console.log('invalid token');
        // Invalid token, clear the session token
        clearSessionToken();
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      // Handle the error
    }
  };
  const setSessionToken = token => {
    localStorage.setItem('sessionToken', token);
  };

  const clearSessionToken = () => {
    localStorage.removeItem('sessionToken');
    setClientUser(null);
  };

  console.log({
    clientUser,
  });
  return (
    <ClientAuthContext.Provider
      value={{
        clientUser,
        setSessionToken,
        clearSessionToken,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
};

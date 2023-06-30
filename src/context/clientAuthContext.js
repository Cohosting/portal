import { httpsCallable } from 'firebase/functions';
import { createContext, useContext, useEffect, useState } from 'react';
import { functions } from '../lib/firebase';
import { ClientPortalContext } from './clientPortalContext';

export const ClientAuthContext = createContext();

export const ClientAuthContextComponent = ({ children }) => {
  const [clientUser, setClientUser] = useState();
  const { clientPortal } = useContext(ClientPortalContext);
  useEffect(() => {
    const storedToken = localStorage.getItem('sessionToken');
    if (storedToken && clientPortal) {
      // Verify the stored token on the server-side and set the user state accordingly
      verifyStoredToken(storedToken);
    }
  }, [clientPortal]);

  const verifyStoredToken = async token => {
    try {
      // Send an API request to the server to verify the token and retrieve user data
      const verifyToken = httpsCallable(functions, 'verifyToken');
      const response = await verifyToken({
        token,
        portalId: clientPortal.id,
      });

      if (response.data.success) {
        const { user } = response.data;

        if (!user.customerId) {
          // create customer  using js fetch to /create-customer
          const response = await fetch(
            `${process.env.REACT_APP_NODE_URL}/create-customer`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                id: user.id,
              }),
            }
          );
          console.log({ response });
        }
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

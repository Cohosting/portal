import React, { createContext, useState, useEffect, useContext } from 'react';
import '../lib/firebase';
import { getOrCreateUser } from '../lib/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';

import { doc, onSnapshot } from 'firebase/firestore';
import useSignupContext from './SignupContext';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const { setStep } = useSignupContext();
  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      if (user) {
        console.log(user);
        onSnapshot(doc(db, 'users', user.uid), snapshot => {
          console.log('getting called');

          let userData = { ...snapshot.data() };
          if (userData.isProfileCompleted === false) {
            setStep(2);
          }

          setUser(snapshot.data());
          setIsAuthenticated(true);
        });
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setUser, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

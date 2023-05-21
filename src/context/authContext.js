import React, { createContext, useState, useEffect, useContext } from 'react';
import '../lib/firebase';
import { getOrCreateUser } from '../lib/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';

import signupContext from './signupContext'
import { doc, onSnapshot } from 'firebase/firestore';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const { setStep, userCredentials ,setUserCredentials }  = useContext(signupContext)


useEffect(() => {
  onAuthStateChanged(auth, async user => {
    if (user) {
      onSnapshot(doc(db, 'users', user.uid), snapshot => {
        let userData = { ...snapshot.data() };
        if (userData.isProfileCompleted === false) {
          setStep(2);
          setUserCredentials({
            ...userCredentials,
            email: userData.email,
            name: userData.name,
            uid: userData.uid,
          });
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
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
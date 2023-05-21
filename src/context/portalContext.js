import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const PortalContext = createContext();

export const PortalContextProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [portal, setPortal] = useState(null);

  useEffect(() => {
    if (!user) return;
    const getData = async () => {
      const id = user.portals[0];
      const ref = doc(db, 'portals', id);
      onSnapshot(ref, snapshot => {
        setPortal(snapshot.data());
      });
    };
    getData();
  }, [user]);

  return (
    <PortalContext.Provider value={{ portal }}>
      {children}
    </PortalContext.Provider>
  );
};

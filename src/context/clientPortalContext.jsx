import React, { createContext, useEffect, useState } from 'react';
import { useSubdomain } from '../hooks/useSubdomain';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const ClientPortalContext = createContext();
export const ClientPortalContextComponent = ({ children }) => {
  const { subdomain, isSubdomainValid } = useSubdomain();
  const [clientPortal, setClientPortal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!subdomain) return;

    const getPortal = async () => {
      // using v9
      const portalRef = query(
        collection(db, 'portals'),
        where('portalURL', '==', subdomain)
      );
      const portalSnapshot = await getDocs(portalRef);
      if (portalSnapshot.empty) {
        setIsLoading(false);
        return;
      }
      const portal = portalSnapshot.docs[0].data();
      setClientPortal(portal);
      setIsLoading(false);
    };
    getPortal();
  }, [subdomain]);

  return (
    <ClientPortalContext.Provider
      value={{
        clientPortal,
        isLoading,
      }}
    >
      {children}
    </ClientPortalContext.Provider>
  );
};

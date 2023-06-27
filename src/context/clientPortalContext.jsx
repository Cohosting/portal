import React, { createContext, useEffect, useState } from 'react';
import { useSubdomain } from '../hooks/useSubdomain';
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
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
      // update the logic for the add-ons here
      setClientPortal(portal);
      setIsLoading(false);
    };
    getPortal();
  }, [subdomain]);

  useEffect(() => {
    if (!clientPortal) return;
    (async () => {
      const currentDate = new Date();
      const currentTimestamp = Math.floor(currentDate.getTime() / 1000);

      if (
        clientPortal?.addOnSubscription?.items?.removeBranding &&
        (currentTimestamp ===
          clientPortal.addOnSubscription.items.removeBranding.will_expire ||
          currentTimestamp >
            clientPortal.addOnSubscription.items.removeBranding.will_expire)
      ) {
        try {
          await updateDoc(db, {
            'addOnSubscription.items.removeBranding': {
              ...clientPortal.addOnSubscription.items.removeBranding,
              active: false,
              will_expire: null,
            },
          });
        } catch (err) {
          console.log(
            'Error while updating the portal remove branding active status and will_expire field removing'
          );
        }
      }
    })();
  }, [clientPortal]);

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

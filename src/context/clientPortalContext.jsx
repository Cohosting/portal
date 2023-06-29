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
  const { domain, isSubdomainValid, portalData } = useSubdomain();
  const [clientPortal, setClientPortal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (!portalData) return;
    (async () => {
      const currentDate = new Date();
      const currentTimestamp = Math.floor(currentDate.getTime() / 1000);

      if (
        portalData?.addOnSubscription?.items?.removeBranding &&
        (currentTimestamp ===
          portalData.addOnSubscription.items.removeBranding.will_expire ||
          currentTimestamp >
          portalData.addOnSubscription.items.removeBranding.will_expire)
      ) {
        try {
          await updateDoc(db, {
            'addOnSubscription.items.removeBranding': {
              ...portalData.addOnSubscription.items.removeBranding,
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
  }, [portalData]);

  return (
    <ClientPortalContext.Provider
      value={{
        portalData,
        isLoading,
      }}
    >
      {children}
    </ClientPortalContext.Provider>
  );
};

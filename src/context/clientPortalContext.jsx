import React, { createContext, useEffect, useState } from 'react';
import { useDomainInfo } from '../hooks/useDomainInfo';
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
  const { domain, isSubdomainValid, } = useDomainInfo(true);




  return (
    <ClientPortalContext.Provider
      value={{
        clientPortal: domain.portalData,
      }}
    >
      {children}
    </ClientPortalContext.Provider>
  );
};

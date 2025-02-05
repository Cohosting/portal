import React, { createContext, useEffect, useState } from 'react';
import { useDomainInfo } from '../hooks/useDomainInfo';


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

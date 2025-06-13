// contexts/PortalContext.jsx
import React, { createContext, useContext } from 'react';

const PortalContext = createContext();

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};

export const PortalProvider = ({ children, portal, portal_apps, isLoading }) => {
  return (
    <PortalContext.Provider value={{ portal, portal_apps, isLoading }}>
      {children}
    </PortalContext.Provider>
  );
};
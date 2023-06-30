import React from 'react';

const SubdomainWrapper = ({ children }) => {
  const currentHost = window.location.hostname;

  if (!currentHost.includes('dashboard')) {
    return <h1>Invalid route! Route not available</h1>;
  }

  return children;
};

export default SubdomainWrapper;

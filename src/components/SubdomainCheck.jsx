import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SubdomainCheck = ({
  children,
  mainDomainComponent,
  isProtected = true,
  domain, isValid, isLoading
}) => {
  const navigate = useNavigate();

  if (domain && isValid && !isLoading && isProtected) {
    const token = localStorage.getItem('sessionToken');
    if (!token) return navigate('/login');
  }

  if (!domain && !mainDomainComponent) return null;

  if (!domain && mainDomainComponent) return mainDomainComponent;

  if (domain && isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (domain && !isValid) return <div className="text-red-500">Invalid subdomain</div>;

  if (domain && isValid && !isLoading) {
    return children;
  };
};

import PortalLoadingSkeleton from '@/pages/Portal/Client/components/PortalLoadingSkeleton';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SubdomainCheck = ({
  children,
  mainDomainComponent,
  isProtected = true,
  domain, 
  isValid, 
  isLoading
}) => {
  const navigate = useNavigate();
  console.log({
    isLoading,
    isValid,
    domain,
    isProtected,
    mainDomainComponent,
    children
  })

  // Handle main domain (no subdomain)
  if (!domain && !mainDomainComponent) return null;
  if (!domain && mainDomainComponent) return mainDomainComponent;

  // Handle subdomain cases
  if (domain) {
    // Show loading while validation is in progress
    if (isLoading) {
      return (
        <PortalLoadingSkeleton  />
      );
    }

    // Only show invalid if we're done loading AND explicitly invalid
    if (!isLoading && isValid === false) {
      return <div className="text-red-500">Invalid subdomain</div>;
    }

    // Only render children if we're done loading AND explicitly valid
    if (!isLoading && isValid === true) {
      // Check authentication for protected routes
      if (isProtected) {
        const token = localStorage.getItem('sessionToken');
        if (!token) {
          navigate('/login');
          return null;
        }
      }
      return children;
    }

    // If we're not loading but isValid is undefined/null, show loading
    // This handles the case where validation hasn't completed yet
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return null;
};
import React, { useState, useEffect, memo } from 'react';

export const AuthLayout = memo(({ portal, title, subtitle, children }) => {
  const { brand_settings } = portal || {};
  const { 
    sidebarBgColor, 
    sidebarTextColor = 'rgb(79, 70, 229)', 
    loginFormTextColor,
    fullLogo, 
    squareLoginImage 
  } = brand_settings || {};

  // Default image URLs
  const defaultImageUrl = "https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80";
  const defaultLogoUrl = "https://fakeimg.pl/800x400";
  
  // Determine the image URLs to use - use memo to prevent recalculation
  const imageUrl = React.useMemo(() => squareLoginImage || defaultImageUrl, [squareLoginImage]);
  const logoUrl = React.useMemo(() => fullLogo || defaultLogoUrl, [fullLogo]);
  
  return (
    <div className="flex h-screen flex-1" style={{ backgroundColor: sidebarBgColor }}>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96" style={{ color: loginFormTextColor }}>
          <div>
            {/* Logo with anti-flicker optimization */}
            <div className="w-auto relative" style={{ minHeight: '40px' }}>
              <img 
                key="company-logo"
                alt="Company Logo" 
                src={logoUrl}
                className="w-auto" 
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)',
                  imageRendering: 'crisp-edges'
                }}
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm leading-6">
                {subtitle}
              </p>
            )}
          </div>
          <div className="mt-10">
            {children}
          </div>
        </div>
      </div>
      
      <div className="relative hidden w-0 flex-1 lg:block">
        {/* Background image with anti-flicker optimization */}
        <img
          key="login-background"
          alt=""
          src={imageUrl}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            imageRendering: 'crisp-edges'
          }}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </div>
  );
});

// Display name for debugging
AuthLayout.displayName = 'AuthLayout';

export default AuthLayout;

 
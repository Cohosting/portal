import React from 'react';





export const Layout = ({ children}) => {
  
  return (
    <div className="flex h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">

        {children}
  
    </div>
  )
}

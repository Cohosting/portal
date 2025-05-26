import React from 'react';

const PortalLoadingSkeleton = () => {
  // Pulse animation color for sidebar items (darker for better contrast against #f9fafb)
  const sidebarPulseColor = "bg-gray-300";
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-60 flex flex-col border-r border-gray-200 bg-[#f9fafb]">
        {/* Logo area */}
        <div className="h-16 flex px-4 items-center border-b border-gray-200">
          <div className={`w-8 h-8 ${sidebarPulseColor} rounded-full animate-pulse`}></div>
          <div className={`w-24 h-5 ${sidebarPulseColor} rounded animate-pulse ml-3`}></div>
        </div>
        
        {/* Menu items */}
        <div className="flex-1 flex flex-col gap-4 px-4 pt-6">
          <div className="h-10 flex items-center gap-3">
            <div className={`w-6 h-6 ${sidebarPulseColor} rounded animate-pulse`}></div>
            <div className={`w-40 h-6 ${sidebarPulseColor} rounded animate-pulse`}></div>
          </div>
          <div className="h-10 flex items-center gap-3">
            <div className={`w-6 h-6 ${sidebarPulseColor} rounded animate-pulse`}></div>
            <div className={`w-36 h-6 ${sidebarPulseColor} rounded animate-pulse`}></div>
          </div>
          <div className="h-10 flex items-center gap-3">
            <div className={`w-6 h-6 ${sidebarPulseColor} rounded animate-pulse`}></div>
            <div className={`w-32 h-6 ${sidebarPulseColor} rounded animate-pulse`}></div>
          </div>
          
          {/* Category label */}
          <div className="mt-4 mb-2">
            <div className={`w-20 h-4 ${sidebarPulseColor} rounded animate-pulse`}></div>
          </div>
          
          {/* More menu items */}
          <div className="h-10 flex items-center gap-3">
            <div className={`w-6 h-6 ${sidebarPulseColor} rounded animate-pulse`}></div>
            <div className={`w-32 h-6 ${sidebarPulseColor} rounded animate-pulse`}></div>
          </div>
          <div className="h-10 flex items-center gap-3">
            <div className={`w-6 h-6 ${sidebarPulseColor} rounded animate-pulse`}></div>
            <div className={`w-28 h-6 ${sidebarPulseColor} rounded animate-pulse`}></div>
          </div>
        </div>

        <div className="flex  items-center pt-6 pb-4 flex-col">
 
        <div className="flex items-center mb-4 px-6 w-full">
                            <div className={`animate-pulse ${sidebarPulseColor} rounded-full h-10 w-10`} ></div>
                            <div className="ml-3 min-w-0 flex-1">
                                <div className={`animate-pulse h-4 ${sidebarPulseColor} rounded w-3/4 mb-2`} ></div>
                                <div className={`animate-pulse h-3 ${sidebarPulseColor} rounded w-1/2`} ></div>
                            </div>

                        </div>
                            <div className={`animate-pulse  ${sidebarPulseColor} h-9 w-10/12 rounded`}  ></div>
        </div>
        

      </div>
      
      {/* Main Content Area Skeleton */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Header Skeleton - with title and description */}
        <div className="h-[64px] border-b border-gray-200 px-6 flex flex-col justify-center">
          <div className="w-64 h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-96 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Simple top loading indicator */}
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mr-3"></div>
            <span className="text-gray-500 text-sm">Loading data...</span>
          </div>
          
 
        </div>
      </div>
    </div>
  );
};

export default PortalLoadingSkeleton;
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import React from 'react';
  
const PageHeader = ({ title, description, action, showSidebar = true }) => {
  const { setOpen } = useSidebar();
  return ( 
    <div className="border-b border-gray-200 px-3 sm:px-6 py-2">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showSidebar && (
            <div className="lg:hidden sm:mt-[4px]">
              <SidebarTrigger onClick={() => setOpen(true)} />
            </div>
          )}
          {/* Title and description */}
          <div>
            <h1 className=" text-xl font-bold text-gray-900">
              {title}
            </h1>
            {description && (
              <p className=" hidden lg:block  text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>
        {/* Action buttons */}
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
};


export default PageHeader;
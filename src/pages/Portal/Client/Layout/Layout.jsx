// Layout.jsx
import React from 'react'
import Sidebar from './Sidebar'
import Navigation from './Navigation'
import { useDomainInfo } from '../../../../hooks/useDomainInfo';
import { useClientPortalData } from '../../../../hooks/react-query/usePortalData';
import { useMediaQuery } from 'react-responsive';
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import PortalLoadingSkeleton from '../components/PortalLoadingSkeleton';

const LayoutContent = ({ children }) => {
    const { open } = useSidebar();
    const { domain } = useDomainInfo();
    const { data: portal, isLoading } = useClientPortalData(domain);

    const portal_apps = portal?.portal_apps || [];
    const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });
    // if (isLoading) return <PortalLoadingSkeleton />;
    
    return (
        <>
            <Sidebar portal={portal} portal_apps={portal_apps} />
            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
                <Navigation portal={portal} portal_apps={portal_apps} />
            </div>
            <main className=" lg:pl-[14.96rem] w-full">
            {
                isLoading && (
         <div className="h-[64px] border-b border-gray-200 px-6 flex flex-col justify-center">
          <div className="w-64 h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="w-96 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
                )
            }
                <div>
                    {children}
                </div>
            </main>
        </>
    )
}

const Layout = ({ children  }) => {
    return (
        <SidebarProvider defaultOpen={false}>
            <LayoutContent >
                {children}
            </LayoutContent>
        </SidebarProvider>
    )
}

export default Layout


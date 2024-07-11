

import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navigation from './Navigation'
import { useDomainInfo } from '../../../../hooks/useDomainInfo';
import { useClientPortalData } from '../../../../hooks/react-query/usePortalData';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { domain } = useDomainInfo();
    const { data: portal, isLoading } = useClientPortalData(domain);

    const portal_apps = portal?.portal_apps || [];
    return (
        <>
            {
                isLoading ? <div>Loading...</div> : (
                    <>
                        <Sidebar portal={portal} portal_apps={portal_apps} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                        {/* Static sidebar for desktop */}
                        <div className="hidden   lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                            <Navigation portal={portal} portal_apps={portal_apps} />
                        </div>
                        <main className="py-10 lg:pl-72">
                            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                        </main>
                    </>
                )
            }


        </>

    )
}

export default Layout
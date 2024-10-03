

import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navigation from './Navigation'
import { useDomainInfo } from '../../../../hooks/useDomainInfo';
import { useClientPortalData } from '../../../../hooks/react-query/usePortalData';
import { useMediaQuery } from '@chakra-ui/react';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { domain } = useDomainInfo();
    const { data: portal, isLoading } = useClientPortalData(domain);

    const portal_apps = portal?.portal_apps || [];
    const [isLessThan1024] = useMediaQuery('(max-width: 1024px)')
    return (

                    <>
                        <Sidebar portal={portal} portal_apps={portal_apps} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                        {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                            <Navigation portal={portal} portal_apps={portal_apps} />
                        </div>
            <main className=" lg:pl-72">
                {/* Mobile header */}
                <div className=" z-50  fixed w-full lg:hidden mb-4 flex items-center justify-between bg-white border-b border-gray-200 p-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-md border border-gray-300"
                    >
                        <svg
                            className="h-6 w-6 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                    <p className="text-lg font-semibold">{portal?.name}</p>
                    <div className="w-8" />
                </div>
                {/* className="px-4 sm:px-6 lg:px-8" */}
                <div className={`${isLessThan1024 ? 'pt-[60px]' : ''}`}>{children}</div>
            </main>



        </>

    )
}

export default Layout
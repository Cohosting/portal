import { useState } from 'react';
import SidebarDialog from './SidebarDialog';
import SidebarStatic from './SidebarStatic';
// import Navbar from './Navbar';
// import MainContent from './MainContent';

export const Layout = ({ children, headerName = 'Dashboard', hideMobileNav = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <SidebarDialog sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SidebarStatic />
      <div className="lg:pl-72">
          {/* Mobile header */}
        {
          !hideMobileNav && (

            <div className="  fixed w-full lg:hidden mb-4 flex items-center justify-between bg-white border-b border-gray-200 p-3">
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
            <p className="text-lg font-semibold">{headerName}</p>
            <div className="w-8" />
          </div>
          )
        }

        <main className={`flex max-lg:pt-16 overflow-y-auto  relative flex-col h-screen   ${hideMobileNav ? 'px-0' : 'px-4'}`}>

          {children}
        </main>
      </div>
    </>
  );
}

import SidebarDialog from './SidebarDialog';
import SidebarStatic from './SidebarStatic';
import { useConversationContext } from '../../context/useConversationContext';
import { useMediaQuery } from 'react-responsive';

export const Layout =
  ({ children,
    headerName = 'Dashboard',
    showSidebar = true,
    hideMobileNav = false,
    containerPaddingStyle = 'lg:pl-[14rem]'
  }) => {
    const { listRef, sidebarOpen, setSidebarOpen } = useConversationContext();
    const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });

    let shouldAddPadding = isLessThan1024 && !window.location.pathname.includes('messages');

    return (
      <>
        <SidebarDialog sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {
          showSidebar && <SidebarStatic />
        }

        <div className={containerPaddingStyle}>
          {/* Mobile header */}
          {
            !hideMobileNav && (
              <div className="z-50 fixed w-full lg:hidden mb-4 flex items-center justify-between bg-white border-b border-gray-200 p-3">
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
          <main ref={listRef} className={`flex unique column-reverse overflow-auto relative flex-col h-screen ${shouldAddPadding ? 'pt-[4rem]' : ''}`}>
            {children}
          </main>
        </div>
      </>
    );
  }

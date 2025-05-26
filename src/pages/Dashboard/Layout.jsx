 import SidebarStatic from './SidebarStatic';
import { useConversationContext } from '../../context/useConversationContext';
import { useMediaQuery } from 'react-responsive';
import { SidebarProvider } from '@/components/ui/sidebar';

export const Layout =
  ({ children,
    headerName = 'Dashboard',
    showSidebar = true,
    hideMobileNav = false,
    containerPaddingStyle = 'lg:pl-[13.8rem]'
  }) => {
    const { listRef} = useConversationContext();
    const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });

    let shouldAddPadding = isLessThan1024 && !window.location.pathname.includes('messages') && !hideMobileNav;

    return (
    <SidebarProvider>
      
         {
          showSidebar &&  <SidebarStatic />
        }

        <div className={`${containerPaddingStyle} w-full` }>
 
          <main ref={listRef} className={`flex unique column-reverse overflow-auto relative flex-col h-screen ${shouldAddPadding ? 'pt-[4rem]' : ''}`}>
             {children}
           </main>
        </div>
      </SidebarProvider>
    );
  }

import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { useConversationContext } from '../../context/useConversationContext';
import { useMediaQuery } from 'react-responsive';
 
// Import Lucide icons
import {
    Inbox,
    File,
    Home,
    Users,
    HandCoins,
    Sliders,
    Settings,
    Monitor,
    LogOut,
    Cog,
    UserCircle
} from "lucide-react";

// Import Sidebar components
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import PortalSwitcher from '@/components/internal/PortalSwitcher';
import useCurrentTeamMember from '@/hooks/react-query/useCurrentTeamMember';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

let isCurrent = (href) => {
    const currentPath = location.pathname;
    
    // Exact match for home
    if (href === '/') {
        return currentPath === '/';
    }
    
    // Exact match for apps page
    if (href === '/apps') {
        return currentPath === '/apps' || currentPath === '/apps/';
    }
    
    // For app-configurations, we want exact segment matching
    if (href.includes('/app-configurations')) {
        return currentPath.includes('/app-configurations');
    }
    
    // For other paths, check if current path starts with href
    return currentPath.startsWith(href) && (
        currentPath.length === href.length || 
        currentPath[href.length] === '/'
    );
};



export default function AppSidebar() {
    const { setSidebarOpen } = useConversationContext();
    const { currentSelectedPortal, user} = useSelector(state => state.auth);
    const { data: teamMember, isLoading  } = useCurrentTeamMember(user?.id, currentSelectedPortal);
    const navigate = useNavigate();
    const location = useLocation();
    const { appId } = useParams();
    const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });

     
// Preference navigation array
const preference = [
    { name: 'App', href: '/apps', icon: Monitor, current: false },
    { name: 'Customize', href: '/customize', icon: Users, current: false },
    { name: 'Portal Settings', href: '/settings/portal', icon: Settings, current: false, 
      children: [
        // based on role filter out the settings options
        teamMember?.role ===  'owner'  && ({
            name: 'Settings', href: '/settings/portal', icon: Cog
        }),
        { name: 'Account', href: '/settings/account', icon: UserCircle },
        { name: 'Subscriptions', href: '/settings/subscriptions', icon: Cog },
        { name: 'Teams', href: '/settings/teams', icon: Users }
      ].filter(Boolean)
    },
];


    // Redux state access
     const { data: portal } = usePortalData(currentSelectedPortal);

    // Portal apps filtering
    let portal_apps = portal?.portal_apps?.filter(app => !app.is_default) || [];
    
    // Navigation array
    const navigation = [
        { name: 'Dashboard', href: '/', icon: Home, current: false },
        { name: 'Clients', href: '/clients', icon: Users, current: false },
        { name: 'Billing', href: '/billing', icon: HandCoins, current: false },
        { name: 'Messages', href: '/messages', icon: Inbox, current: false },
        { name: 'Files', href: '/files', icon: File, current: false },
        {
            name: 'App Configurations', 
            href: `${portal_apps.length ? `/apps/${portal_apps[0]?.id}/app-configurations/` : '/apps/no-apps/app-configurations'}`, 
            icon: Sliders, 
            current: false, 
            children: portal_apps
        },
    ];

    // Handle navigation with closing sidebar
    const handleNavigation = (href) => {
        navigate(href);
        setSidebarOpen(false);
    };
    console.log({teamMember});

    let portal_redirect_url =  window.location.href.replace('dashboard', portal?.portal_url)  
 

    return (
        <Sidebar className="border-r bg-gray-50">
            <SidebarHeader className="px-4 py-4 pb-0">
                <PortalSwitcher />
            </SidebarHeader>

            <SidebarContent className="px-2 py-2 ">
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => (
                                !item.children?.length ? (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            onClick={() => handleNavigation(item.href)}
                                            className={classNames(
                                                isCurrent(item.href) ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-100'
                                            )}
                                        >
                                            <item.icon className="mr-2 h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ) : (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            className={classNames(
                                                isCurrent(item.href) ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-100',
                                                'justify-between'
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <item.icon className="mr-2 h-4 w-4 text-gray-500" />
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            {/* <ChevronRight className={classNames(
                                                isCurrent(item.href) ? 'rotate-90' : '',
                                                'h-4 w-4 text-gray-500'
                                            )} /> */}
                                        </SidebarMenuButton>
                                        
                                        {/* Submenu for app configurations */}
                                        <SidebarMenuSub>
                                            {item.children.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.name}>
                                                    <SidebarMenuSubButton
                                                        onClick={() => handleNavigation(`/apps/${subItem?.id}/app-configurations`)}
                                                        className={classNames(
                                                            subItem.id === appId ? 'border-l-2 border-gray-500 bg-gray-100 text-black font-medium rounded-none cursor-pointer' : 'text-gray-600 hover:bg-gray-100 rounded-none cursor-pointer' 
                                                        )}
                                                    >
                                                        <span className="text-sm font-medium">{subItem.name}</span>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </SidebarMenuItem>
                                )
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Preference Section */}
                <SidebarGroup className="mt-6">
                    <SidebarGroupLabel className="text-xs font-medium text-gray-500 px-2">
                        Preference
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {preference.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    {!item.children ? (
                                        <SidebarMenuButton
                                            onClick={() => handleNavigation(item.href)}
                                            className={classNames(
                                                isCurrent(item.href) ? 'bg-gray-100 text-black font-medium' : 'text-gray-600 hover:bg-gray-100'
                                            )}
                                        >
                                            <item.icon className="mr-2 h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </SidebarMenuButton>
                                    ) : (
                                        <>
                                            <SidebarMenuButton className="justify-between   text-black font-medium">
                                                <div className="flex items-center">
                                                    <item.icon className="mr-2 h-4 w-4 text-gray-500" />
                                                    <span className="text-sm font-medium">{item.name}</span>
                                                </div>
                                                {/* <ChevronDown className="h-4 w-4 text-gray-500" /> */}
                                            </SidebarMenuButton>
                                            
                                            {/* Always visible submenu for Portal Settings */}
                                            <SidebarMenuSub>
                                                {item.children.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.name}>
                                                        <SidebarMenuSubButton
                                                            onClick={() => handleNavigation(subItem.href)}
                                                            className={classNames(
                                                                isCurrent(subItem.href) ? 'border-l-2 border-gray-500 bg-gray-100 text-black font-medium rounded-none cursor-pointer' : 'text-gray-600 hover:bg-gray-100 rounded-none cursor-pointer'
                                                            )}
                                                        >
                                                            <subItem.icon className="mr-2 h-4 w-4 text-gray-500" />
                                                            <span className="text-sm font-medium">{subItem.name}</span>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer with Portal View link */}
            <SidebarFooter className="mt-auto border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            as="a"
                            href={portal_redirect_url}
                            className="text-gray-600 hover:bg-gray-100"
                        >
                            <LogOut className="mr-2 h-4 w-4 text-sm  font-medium text-gray-500" />
                            <a
                            href={portal_redirect_url} >
                             Portal View
                             </a>

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
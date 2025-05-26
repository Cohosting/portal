import React from 'react';

const NavItem = ({ children, isActive, ...rest }) => (
    <div
        className={`cursor-pointer my-1 py-2 px-4 rounded-md ${isActive ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-500'
            } hover:${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
        {...rest}
    >
        <span className="text-md">{children}</span>
    </div>
);

const Sidebar = ({ apps, portalName, settings, onClose, navigate, ref }) => (
    <div
        ref={ref}
        style={{ zIndex: 99999 }}
        className={`w-60 h-full ${settings?.sidebarBgColor || 'bg-gray-100'} ${settings?.sidebarTextColor || 'text-gray-800'} p-4`}
    >
        <span>{settings?.brandName}</span>
        {apps.map((app) => (
            <NavItem
                key={app.id}
                isActive={app?.name.toLowerCase() === portalName?.toLowerCase()}
                onClick={() => {
                    onClose();
                    navigate(`/portal/${app.name}`);
                }}
            >
                {app.name}
            </NavItem>
        ))}
    </div>
);
export default Sidebar;
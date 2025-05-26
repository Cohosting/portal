import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { lighten, transparentize } from "polished";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  HelpCircle,
  MessageSquare,
  FileText,
  CreditCard
} from "lucide-react";
import { PreloadedIcons } from "@/components/preloaded-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClientAuth } from "@/hooks/useClientAuth";
import { classNames } from "../../../../utils/statusStyles";

// ----------------------------------------------
// 1. Static fallback icon map
// ----------------------------------------------
const DEFAULT_ICONS = {
  'Messages': MessageSquare,
  'messages': MessageSquare,
  'Files': FileText,
  'files': FileText,
  'Billings': CreditCard,
  'billings': CreditCard
};

// ----------------------------------------------
// 2. Convert to kebab-case (from PascalCase/Icon/etc.)
// ----------------------------------------------
const toKebabCase = (str) =>
  str
    ?.replace(/Icon$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase() || 'help-circle';

// ----------------------------------------------
// 3. Get icon name for this app based on client ID
// ----------------------------------------------
const getResolvedIconName = (app, clientUserId) => {
  const { settings, icon } = app;

  let rawIconName = icon;

  // if (settings?.setupType === "manual") {
  //   const clientSettings = settings.clientsSettings || [];
  //   const match = clientSettings.find(cs => cs.clientId === clientUserId);
  //   rawIconName = match?.icon;
  // }

  return rawIconName|| "help-circle" ;
};

// ----------------------------------------------
// 4. Final icon rendering function
// ----------------------------------------------
const RenderIcon = ({ iconName, className }) => {
  // First: use fallback map
  if (DEFAULT_ICONS[iconName]) {
    const Icon = DEFAULT_ICONS[iconName];
    return <Icon className={className} />;
  }
  console.log({
    iconName,
  })

  // Second: try preloaded icons
  const Icon = PreloadedIcons[iconName];
  if (Icon) return <Icon className={className} />;

  // Last: fallback icon
  return <HelpCircle className={className} />;
};

// ----------------------------------------------
// 5. Main Navigation
// ----------------------------------------------
const Navigation = ({ portal_apps, portal }) => {
  const { clientUser } = useClientAuth(portal?.id);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    sidebarBgColor,
    sidebarTextColor = 'rgb(79, 70, 229)',
    accentColor = 'rgb(79, 70, 229)',
    sidebarActiveTextColor,
    fullLogo,
    loginButtonColor,
    loginButtonTextColor
  } = portal?.brand_settings || {};

  const sidebarItemHoverBgColor = transparentize(0.8, accentColor);
  const sidebarItemHoverColor = lighten(0.2, sidebarTextColor);

  const getUserInitials = () => {
    if (!clientUser?.name) return "U";
    const [first, second] = clientUser.name.split(" ");
    return (first?.[0] + (second?.[0] || '')).toUpperCase();
  };

  return (
    <div
      style={{ backgroundColor: sidebarBgColor }}
      className="flex grow flex-col gap-y-5 overflow-y-auto pb-2  "
    >
      <div className="flex h-16 shrink-0 px-6 items-center">
        <img
          alt="Your Company"
          src={fullLogo || "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"}
          className="h-8 w-auto"
        />
      </div>

      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-1">
          {portal_apps.map((item) => {
            const decodedPath = decodeURIComponent(location.pathname.split('/')[2]);
            console.log({
              decodedPath})
            const active = item.name.toLowerCase() === decodedPath.toLowerCase();
            const resolvedIconName = getResolvedIconName(item, clientUser?.id);

            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(`/portal/${item.name.toLowerCase()}`)}
                  className={classNames(
                    'group flex gap-x-3 px-6   py-3 text-sm font-semibold leading-6 w-full',
                    { 'hover:bg-opacity-20': !active }
                  )}
                  style={{
                    color: active ? sidebarActiveTextColor : sidebarTextColor,
                    backgroundColor: active ? `${accentColor}33` : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = sidebarItemHoverBgColor;
                    e.currentTarget.style.color = sidebarItemHoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = active ? `${accentColor}33` : 'transparent';
                    e.currentTarget.style.color = active ? sidebarActiveTextColor : sidebarTextColor;
                  }}
                >
                  <RenderIcon
                    iconName={resolvedIconName}
                    className={classNames(
                      'h-6 w-6 shrink-0',
                      { 'text-opacity-80 group-hover:text-opacity-80': !active },
                      { 'text-opacity-100': active }
                    )}
                  />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="border-t flex flex-col items-center pt-6 pb-4" style={{ borderColor: `${loginButtonColor}44` }}>
          {!clientUser ? (
            <div className="flex items-center mb-4 px-6 w-full">
              <div className="animate-pulse rounded-full h-10 w-10" style={{ backgroundColor: loginButtonColor }}></div>
              <div className="ml-3 min-w-0 flex-1">
                <div className="animate-pulse h-4 rounded w-3/4 mb-2" style={{ backgroundColor: loginButtonColor }}></div>
                <div className="animate-pulse h-3 rounded w-1/2" style={{ backgroundColor: loginButtonColor }}></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center mb-4 px-6">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage
                  src={clientUser?.profilePicture || clientUser?.avatar || ""}
                  alt={clientUser?.name || "User"}
                />
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 min-w-0 flex-1">
                {clientUser?.name && (
                  <p className="text-sm font-medium truncate" style={{ color: sidebarTextColor }}>
                    {clientUser.name}
                  </p>
                )}
                {clientUser?.email && (
                  <p className="text-xs truncate opacity-75" style={{ color: sidebarTextColor }}>
                    {clientUser.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {!clientUser ? (
            <div className="animate-pulse h-9 w-10/12 rounded" style={{ backgroundColor: loginButtonColor }}></div>
          ) : (
            <Button
              onClick={() => {
                localStorage.removeItem('sessionToken');
                window.location.href = '/login';
              }}
              style={{
                backgroundColor: loginButtonColor,
                color: loginButtonTextColor,
              }}
              className="w-10/12"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;

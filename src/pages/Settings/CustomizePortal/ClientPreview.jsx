// ClientPreview.jsx
import React, { useState } from 'react';
import { MessageSquare, FileText, Settings, User, LogOut, ChevronDown, MapPin, Camera } from 'lucide-react';

const SidebarItem = ({
  icon,
  label,
  active,
  textColor,
  activeTextColor,
  activeBgColor,
  hoverBgColor
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const backgroundColor = active
    ? activeBgColor
    : isHovered
    ? hoverBgColor
    : 'transparent';

  const color = active ? activeTextColor : textColor;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md transition-all cursor-pointer"
      style={{ backgroundColor, color }}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

const Avatar = ({ children, className }) => (
  <div className={`rounded-full flex items-center justify-center ${className}`}>
    {children}
  </div>
);

const AvatarFallback = ({ children, className }) => (
  <div className={`flex items-center justify-center w-full h-full rounded-full ${className}`}>
    {children}
  </div>
);

const ClientPreview = ({ brandSettings, computedColors }) => {
  const {
    sidebarBgColor,
    sidebarTextColor,
    sidebarActiveTextColor,
    sidebarActiveBgColor,
    sidebarHoverBgColor,
    sidebarPrimaryTextColor,
    loginButtonColor,
    loginButtonTextColor,
    dividerColor,
  } = computedColors;

  const { brandName = 'Portal', poweredByCopilot } = brandSettings;

  // Mock user data for preview
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar_url: null
  };

  const getUserInitials = () => {
    if (!mockUser?.name) return 'U';
    const [first, second] = mockUser.name.split(' ');
    return (first[0] + (second?.[0] || '')).toUpperCase();
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <div className="flex w-full">
        {/* Sidebar */}
        <div
          className="w-48 h-[500px] flex-shrink-0 flex flex-col"
          style={{ backgroundColor: sidebarBgColor }}
        >
          {/* Logo / Brand */}
          <div className="py-3 px-4 flex items-center">
            {brandSettings.assets.squareIcon ? (
              <img src={brandSettings.assets.squareIcon} alt="Logo" className="w-full" />
            ) : (
              <div className="text-lg font-bold" style={{ color: sidebarPrimaryTextColor }}>
                {brandName?.charAt(0) || 'H'}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-2">
            <SidebarItem
              icon={<MessageSquare className="w-5 h-5" />}
              label="Messages"
              active
              textColor={sidebarTextColor}
              activeTextColor={sidebarActiveTextColor}
              activeBgColor={sidebarActiveBgColor}
              hoverBgColor={sidebarHoverBgColor}
            />
            <SidebarItem
              icon={<FileText className="w-5 h-5" />}
              label="Files"
              active={false}
              textColor={sidebarTextColor}
              activeTextColor={sidebarActiveTextColor}
              activeBgColor={sidebarActiveBgColor}
              hoverBgColor={sidebarHoverBgColor}
            />
            <SidebarItem
              icon={<User className="w-5 h-5" />}
              label="Team"
              active={false}
              textColor={sidebarTextColor}
              activeTextColor={sidebarActiveTextColor}
              activeBgColor={sidebarActiveBgColor}
              hoverBgColor={sidebarHoverBgColor}
            />
            <SidebarItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              active={false}
              textColor={sidebarTextColor}
              activeTextColor={sidebarActiveTextColor}
              activeBgColor={sidebarActiveBgColor}
              hoverBgColor={sidebarHoverBgColor}
            />
          </nav>

          {/* User Profile Section */}
          <div 
            className="border-t flex flex-col items-center pt-3 pb-2" 
            style={{ borderColor: dividerColor }}
          >
            <div className="flex items-center mb-2 px-3 w-full">
              <div className="relative group cursor-pointer">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-3 w-3 text-white" />
                </div>
              </div>

              <div 
                className="flex items-center ml-2 hover:opacity-80 transition-opacity min-w-0 flex-1 cursor-pointer" 
                style={{ color: sidebarPrimaryTextColor }}
              >
                <div className="text-left min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{mockUser.name}</p>
                  <p className="text-[10px] truncate opacity-75">{mockUser.email}</p>
                </div>
                <ChevronDown className="h-3 w-3 ml-1 shrink-0" />
              </div>
            </div>

            {/* Logout Button */}
            <div 
              className="w-10/12 px-2 py-1.5 rounded text-xs flex items-center justify-center cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: loginButtonColor, color: loginButtonTextColor }}
            >
              <LogOut className="mr-1 h-3 w-3" />
              Logout
            </div>
          </div>

          {/* Footer */}
          {poweredByCopilot && (
            <div
              className="p-4 text-xs text-center opacity-60"
              style={{ color: sidebarTextColor }}
            >
              Powered by Copilot
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-6">Messages</h2>

          {/* Message List */}
          <div className="space-y-3">
            {/* Content area for messages would go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPreview;
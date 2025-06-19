// ClientPreview.jsx
import React, { useState } from 'react';
import { MessageSquare, FileText, Settings, User } from 'lucide-react';

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
  console.log({
    activeBgColor
  })

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

const ClientPreview = ({ brandSettings, computedColors }) => {
  const {
    sidebarBgColor,
    sidebarTextColor,
    sidebarActiveTextColor,
    sidebarActiveBgColor,
    sidebarHoverBgColor,
    accentColor,
    backgroundColor,
    messageActiveItemBg,
    messageActiveItemBorder,
    messageActiveItemText,
    borderColor
  } = computedColors;

  console.log({
    computedColors
  })

  const { brandName = 'Portal', poweredByCopilot } = brandSettings;

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <div className="flex w-full">
        {/* Sidebar */}
        <div
          className="w-48 h-[500px] flex-shrink-0 flex flex-col"
          style={{ backgroundColor: sidebarBgColor }}
        >
          {/* Logo / Brand */}
          {/* <div
            className="p-4 border-b"
            style={{ borderColor: `${sidebarTextColor}20` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor
                }}
              >
                {brandName.charAt(0)}
              </div>
              <div
                className="font-semibold truncate"
                style={{ color: sidebarTextColor }}
              >
                {brandName}
              </div>
            </div>
          </div> */}
          <div className="py-3 px-4">
            <div className="text-lg font-bold" style={{ color: sidebarTextColor }}>
              {brandName?.charAt(0) || 'H'}
            </div>
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
        <div
          className="flex-1 p-6"
         >
          <h2 className="text-xl font-semibold mb-6">Messages</h2>

          {/* Message List */}
          <div className="space-y-3">
            {/* Active Message */}
            {/* <div
              className="p-4 rounded-lg border-l-4 transition-all cursor-pointer"
              style={{
                backgroundColor: messageActiveItemBg,
                borderLeftColor: messageActiveItemBorder,
                color: messageActiveItemText
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">Sarah Johnson</div>
                  <div className="text-sm mt-1 opacity-80">
                    Hey, I&apos;ve reviewed the latest proposal and have some
                    feedback...
                  </div>
                  <div className="text-xs mt-2 opacity-60">2 hours ago</div>
                </div>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            </div> */}

            {/* Regular Messages */}
 
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPreview;

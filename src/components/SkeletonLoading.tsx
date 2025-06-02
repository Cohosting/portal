import React from "react";

export const CustomSkeleton = (props) => (
  <div
    className={`bg-gray-200 rounded ${props.className}`}
    style={{ opacity: 0.7 }}
  />
);
const DashboardSkeleton = () => {
  // Custom skeleton that doesn't have the visible pulse animation

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - exact match at 220px width with #f9fafb bg */}
      <div className="w-[220px] bg-[#f9fafb] border-r border-gray-200 flex flex-col h-full">
        {/* Organization switcher - without bottom border, without right pulse */}
        <div className="p-4 flex items-center">
          <div className="flex items-center gap-3">
            <CustomSkeleton className="h-8 w-8 rounded-md" />
            <div className="flex flex-col">
              <CustomSkeleton className="h-4 w-20" />
              <CustomSkeleton className="h-3 w-12 mt-1" />
            </div>
          </div>
        </div>

        {/* Main navigation - with increased spacing between items */}
        <div className="flex-1 py-2">
          {/* Dashboard */}
          <div className="flex items-center gap-3 py-3 px-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-20" />
          </div>

          {/* Clients */}
          <div className="flex items-center gap-3 py-3 px-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-16" />
          </div>

          {/* Files */}
          <div className="flex items-center gap-3 py-3 px-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-12" />
          </div>

          {/* Messages */}
          <div className="flex items-center gap-3 py-3 px-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-20" />
          </div>

          {/* Billing */}
          <div className="flex items-center gap-3 py-3 px-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-14" />
          </div>

          {/* App Configurations */}
          <div className="flex items-center gap-3 py-3 px-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-36" />
          </div>

          {/* Ticket support - indented */}
          <div className="flex items-center gap-3 py-3 pl-12 pr-6">
            <CustomSkeleton className="h-4 w-24" />
          </div>

          {/* Preference section label */}
          <div className="px-6 pt-6 pb-2">
            <CustomSkeleton className="h-4 w-20" />
          </div>

          {/* App */}
          <div className="flex items-center gap-3 py-3 px-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-10" />
          </div>

          {/* Customize */}
          <div className="flex items-center gap-3 py-3 px-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-20" />
          </div>

          {/* Portal Settings */}
          <div className="flex items-center gap-3 py-3 px-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-28" />
          </div>

          {/* Settings - indented */}
          <div className="flex items-center gap-3 py-3 pl-12 pr-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-16" />
          </div>

          {/* Account - indented */}
          <div className="flex items-center gap-3 py-3 pl-12 pr-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-16" />
          </div>

          {/* Subscriptions - indented */}
          <div className="flex items-center gap-3 py-3 pl-12 pr-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-24" />
          </div>

          {/* Teams - indented */}
          <div className="flex items-center gap-3 py-3 pl-12 pr-6">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-14" />
          </div>
        </div>

        {/* Portal View button at bottom */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <CustomSkeleton className="h-4 w-4" />
            <CustomSkeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Main content - with white background */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header - as skeleton */}
        <header className="bg-white border-b border-gray-200 p-6">
          <div className="flex flex-col">
            <CustomSkeleton className="h-6 w-32 mb-2" />
            <CustomSkeleton className="h-4 w-80" />
          </div>
        </header>

        {/* Dashboard content - completely empty as requested */}
        <main className="flex-1 overflow-auto p-6 bg-white">
          {/* Intentionally left empty as requested */}
        </main>
      </div>
    </div>
  );
};

export default DashboardSkeleton;

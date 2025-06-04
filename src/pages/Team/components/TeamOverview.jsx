import React from 'react';
import { Users, BarChart2 } from 'lucide-react';

const TeamOverview = ({ teamMembers }) => {
  const FREE_MEMBERS_LIMIT = 5;
  const memberCount = teamMembers.length;
  const paidMembersCount = Math.max(0, memberCount - FREE_MEMBERS_LIMIT);
  const freeSlots = Math.max(0, FREE_MEMBERS_LIMIT - memberCount);
  const usagePercentage = Math.min((memberCount / FREE_MEMBERS_LIMIT) * 100, 100);

  return (
    <div className="px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Members</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{memberCount}</p>
            <p className="mt-1 text-sm text-gray-500">
              {freeSlots > 0
                ? `${freeSlots} free slot${freeSlots > 1 ? 's' : ''} remaining`
                : `${paidMembersCount} paid member${paidMembersCount > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Admins</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {teamMembers.filter((m) => m.role === 'admin').length}
            </p>
          </div>
        </div>
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="p-2 bg-purple-100 rounded-full flex-shrink-0">
            <BarChart2 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4 w-full">
            <p className="text-sm font-medium text-gray-600">Team Member Usage</p>
            <div className="mt-2 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-2 bg-purple-600 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>{FREE_MEMBERS_LIMIT} (Free Limit)</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {paidMembersCount > 0
                ? `Current additional cost: $${paidMembersCount * 20} /month`
                : "You're within the free member limit"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;

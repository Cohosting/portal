// Example team page we would like to be
import React, { useState } from 'react';
import { Users, Plus, Download, MoreHorizontal, Shield, User } from 'lucide-react';

const TeamManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const adminUsers = [
    {
      id: 1,
      name: 'Olivia Rhye',
      email: 'olivia@company.com',
      avatar: 'OR',
      dateAdded: 'Feb 22, 2024',
      status: 'Active',
      role: 'Product Manager'
    },
    {
      id: 2,
      name: 'Phoenix Baker',
      email: 'phoenix@company.com',
      avatar: 'PB',
      dateAdded: 'Feb 22, 2024',
      status: 'Active',
      role: 'Lead Developer'
    },
    {
      id: 3,
      name: 'Lana Steiner',
      email: 'lana@company.com',
      avatar: 'LS',
      dateAdded: 'Feb 22, 2024',
      status: 'Offline',
      role: 'Operations Manager'
    },
    {
      id: 4,
      name: 'Demi Wilkinson',
      email: 'demi@company.com',
      avatar: 'DW',
      dateAdded: 'Feb 22, 2024',
      status: 'Active',
      role: 'UI/UX Designer'
    }
  ];

  const accountUsers = [
    {
      id: 5,
      name: 'Natali Craig',
      email: 'natali@company.com',
      avatar: 'NC',
      dateAdded: 'Feb 22, 2024',
      status: 'Active',
      role: 'Marketing Specialist'
    },
    {
      id: 6,
      name: 'Drew Cano',
      email: 'drew@company.com',
      avatar: 'DC',
      dateAdded: 'Feb 22, 2024',
      status: 'Active',
      role: 'Customer Success'
    },
    {
      id: 7,
      name: 'Orlando Diggs',
      email: 'orlando@company.com',
      avatar: 'OD',
      dateAdded: 'Feb 22, 2024',
      status: 'Active',
      role: 'Software Engineer'
    },
    {
      id: 8,
      name: 'Andi Lane',
      email: 'andi@company.com',
      avatar: 'AL',
      dateAdded: 'Feb 22, 2024',
      status: 'Active',
      role: 'Finance Analyst'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Offline': return 'text-gray-600 bg-gray-50';
      case 'Invited': return 'text-blue-600 bg-blue-50';
      case 'Available': return 'text-orange-600 bg-orange-50';
      case 'Owner': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const UserRow = ({ user, isAdmin = false }) => (
    <>
      {/* Desktop Table Row */}
      <tr className="border-b border-gray-100 hover:bg-gray-50 hidden md:table-row">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {user.avatar}
            </div>
            <div>
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
            {user.status}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className="text-sm text-gray-900">{user.role}</span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">{user.dateAdded}</td>
        <td className="px-6 py-4">
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </td>
      </tr>
      
      {/* Mobile Card Layout */}
      <tr className="md:hidden">
        <td colSpan="5" className="px-4 py-3">
          <div className="bg-white border-gray-200 rounded-lg py-2 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 truncate">{user.name}</div>
                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">{user.email}</div>
                  <div className="text-sm text-gray-500 mt-1">{user.role}</div>
                  <div className="text-xs text-gray-400 mt-1">{user.dateAdded}</div>
                </div>
              </div>
              <button className="ml-2 text-gray-400 hover:text-gray-600 p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </td>
      </tr>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-0 py-8 pt-1">

        <div className="space-y-8">
          {/* Admin Users Section */}
          <div className="bg-white   rounded-lg">
            <div className="px-6 py-4 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Admin Users
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Admins can add and remove users and manage organization-level settings.</p>
                </div>

              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 hidden md:table-header-group">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 md:divide-y-0">
                  {adminUsers.map((user) => (
                    <UserRow key={user.id} user={user} isAdmin={true} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Account Users Section */}
          <div className="bg-white   rounded-lg">
            <div className="px-6 py-4 pt-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Account Users
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Account users can access and review risks, questionnaires, and identify breaches.</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 hidden md:table-header-group">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 md:divide-y-0">
                  {accountUsers.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagementPage;
import React, { useState } from 'react'
import { useQueryClient } from 'react-query'
import { ChevronDown, Trash2, Loader, Shield, User, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
 import AlertDialog from '@/components/Modal/AlertDialog'
import InviteTeamMemberModal from './InviteTeamMemberModal'
 import useRealtimeSeats from '../../../hooks/react-query/useRealtimeSeats'
import { queryKeys } from '../../../hooks/react-query/queryKeys'
import { capitalize } from '@/utils'

const TeamMembersTable = ({ 
  teamMembers = [],
  portal,
  invite,
  removeTeamMember,
  loading: removeLoading,
  loadingCurrentTeamMember,
  currentTeamMember,
  isInviteOpen, setIsInviteOpen
 }) => {
  const queryClient = useQueryClient()

  const { seats } = useRealtimeSeats(portal?.id)

   const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInvite = async (data) => {
    if (isLoading) return;
    setIsLoading(true);
  
    const { seat, ...restData } = data;
    const teamMemberData = {
      portal_id: portal?.id,
      status: 'invited',
      ...restData,
    };
  
    try {
      // Always create a new seat, so seatId is null
      await invite(null, teamMemberData);
      await queryClient.invalidateQueries(queryKeys.teamMembers(portal?.id));
    } catch (error) {
      console.error('Error inviting team member:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const openRemoveDialog = (member) => {
    setSelectedMember(member)
    setIsAlertOpen(true)
  }

  const onRemoveConfirm = async () => {
    if (!selectedMember) return
    try {
      await removeTeamMember(selectedMember.id)
      await queryClient.invalidateQueries(queryKeys.teamMembers(portal?.id))
    } catch (error) {
      console.error('Error removing team member:', error)
    } finally {
      setIsAlertOpen(false)
      setSelectedMember(null)
    }
  }

  if (loadingCurrentTeamMember) {
    return (
      <div className="flex items-center justify-center">
        <Loader className="animate-spin" size={46} />
      </div>
    )
  }

  const canRemove = (memberRole) => {
    const myRole = currentTeamMember?.role
  
    if (myRole === 'owner') {
      return memberRole !== 'owner'
    }
  
    if (myRole === 'admin') {
      return memberRole !== 'owner' && memberRole !== 'admin'
    }
  
    return false
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'active': return 'text-green-600 bg-green-50'
      case 'offline': return 'text-gray-600 bg-gray-50'
      case 'invited': return 'text-blue-600 bg-blue-50'
      case 'available': return 'text-orange-600 bg-orange-50'
      case 'owner': return 'text-purple-600 bg-purple-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner':
        // darkest text, slightly richer bg, bold to stand out
        return 'text-gray-800 bg-gray-100 font-semibold'
      case 'admin':
        // middle-weight text and bg
        return 'text-gray-700 bg-gray-50'
      case 'member':
        // lightest text, same bg as admin
        return 'text-gray-600 bg-gray-50'
      default:
        // fallback neutral
        return 'text-gray-600 bg-gray-50'
    }
  }
  
  // Separate admin and regular users
  const adminUsers = teamMembers.filter(member => member.role === 'owner' || member.role === 'admin')
  const accountUsers = teamMembers.filter(member => member.role === 'member')

  const UserRow = ({ member, isAdmin = false }) => {
    const user = member.user || {}
    const displayName = user.name || member.name || 'Unknown'
    const displayEmail = user.email || member.email || 'Unknown'
    const avatarUrl = user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`
    
    // Create initials from name
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    
    return (
      <>
        {/* Desktop Table Row */}
        <tr className="border-b border-gray-100 hover:bg-gray-50 hidden md:table-row">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {initials}
              </div>
              <div>
                <div className="font-medium text-gray-900">{displayName}</div>
                <div className="text-sm text-gray-500">{displayEmail}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status || 'active')}`}>
              {member.status || 'Active'}
            </span>
          </td>
          <td className="px-6 py-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
              {capitalize(member?.role)}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-gray-500">
            {member.created_at ? new Date(member.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }) : 'Feb 22, 2024'}
          </td>
          <td className="px-6 py-4">
            {canRemove(member.role) ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32 bg-white p-0">
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0">
                    <button
                      onClick={() => openRemoveDialog(member)}
                      className="w-full text-left flex items-center px-3   text-sm leading-6 text-gray-900"
                    >
                      <Trash2 className="h-4 w-4 text-red-500 mr-2" />
                      Remove
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button className="text-gray-400 cursor-not-allowed">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            )}
          </td>
        </tr>
        
        {/* Mobile Card Layout */}
        <tr className="md:hidden">
          <td colSpan="5" className="px-4 py-3">
            <div className="bg-white border-gray-200 rounded-lg py-2 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 truncate">{displayName}</div>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status || 'active')}`}>
                        {member.status || 'Active'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">{displayEmail}</div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {capitalize(member.role)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {member.created_at ? new Date(member.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'Feb 22, 2024'}
                    </div>
                  </div>
                </div>
                {canRemove(member.role) ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="ml-2 text-gray-400 hover:text-gray-600 p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32 bg-white p-0">
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0">
                        <button
                          onClick={() => openRemoveDialog(member)}
                          className="w-full text-left flex items-center px-3 py-2 text-sm leading-6 text-gray-900"
                        >
                          <Trash2 className="h-4 w-4 text-red-500 mr-2" />
                          Remove
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <button className="ml-2 text-gray-400 cursor-not-allowed p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </td>
        </tr>
      </>
    )
  }

  return (
    <div className="  bg-white">
      <div className="max-w-7xl mx-auto px-0 py-8 pt-1">
        <div className="space-y-8">
          {/* Admin Users Section */}
          {adminUsers.length > 0 && (
            <div className="bg-white rounded-lg">
              <div className="px-4 sm:px-6 py-4 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Admin Users
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Admins can add and remove users and manage organization-level settings.</p>
                  </div>
                  {/* {(currentTeamMember?.role === 'owner' || currentTeamMember?.role === 'admin') && (
                    <Button
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={() => setIsInviteOpen(true)}
                    >
                      Add Member
                    </Button>
                  )} */}
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
                    {adminUsers.map((member) => (
                      <UserRow key={member.id} member={member} isAdmin={true} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Account Users Section */}
          {accountUsers.length > 0 && (
            <div className="bg-white rounded-lg">
              <div className="px-4 sm:px-6 py-4 pt-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Account Users
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Account users can access and review risks, questionnaires, and identify breaches.</p>
                  </div>
                  {/* {adminUsers.length === 0 && (currentTeamMember?.role === 'owner' || currentTeamMember?.role === 'admin') && (
                    <Button
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={() => setIsInviteOpen(true)}
                    >
                      Add Member
                    </Button>
                  )} */}
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
                    {accountUsers.map((member) => (
                      <UserRow key={member.id} member={member} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fallback for when no users are categorized */}
          {adminUsers.length === 0 && accountUsers.length === 0 && teamMembers.length > 0 && (
            <div className="bg-white rounded-lg">
              <div className="px-6 py-4 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Team Members
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Manage your team members and their permissions.</p>
                  </div>
                  {/* {(currentTeamMember?.role === 'owner' || currentTeamMember?.role === 'admin') && (
                    <Button
                      className="bg-black text-white hover:bg-gray-800"
                      onClick={() => setIsInviteOpen(true)}
                    >
                      Add Member
                    </Button>
                  )} */}
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
                    {teamMembers.map((member) => (
                      <UserRow key={member.id} member={member} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <InviteTeamMemberModal
        isLoading={isLoading}
        portalId={portal?.id}
        onSubmit={handleInvite}
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        currentTeamMember={currentTeamMember}
        teamMembers={teamMembers}
      />

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title="Remove Member"
        message="Are you sure you want to remove this member?"
        confirmButtonText={removeLoading ? 'Removing...' : 'Remove'}
        cancelButtonText="Cancel"
        onConfirm={onRemoveConfirm}
      />
    </div>
  )
}

export default TeamMembersTable
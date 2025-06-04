import React, { useState } from 'react'
import { useQueryClient } from 'react-query'
import { ChevronDown, Trash2, Loader } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import AlertDialog from '@/components/Modal/AlertDialog'
import InviteTeamMemberModal from './InviteTeamMemberModal'
import useTeamManagement from '../../../hooks/useTeamManagement'
import useRealtimeSeats from '../../../hooks/react-query/useRealtimeSeats'
import { queryKeys } from '../../../hooks/react-query/queryKeys'

const TeamMembersTable = ({ teamMembers = [], portal }) => {
  const queryClient = useQueryClient()
  const {
    invite,
    removeTeamMember,
    loading: removeLoading,
    loadingCurrentTeamMember,
    currentTeamMember,
  } = useTeamManagement(portal, true)
  const { seats } = useRealtimeSeats(portal?.id)

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInvite = async (data) => {
    if (isLoading) return
    setIsLoading(true)

    let { seat, ...restData } = data
    const teamMemberData = {
      portal_id: portal?.id,
      status: 'invited',
      ...restData,
    }

    try {
      const availableSeat = seats.find((s) => s.status === 'available')
      if (availableSeat) {
        await invite(availableSeat.id, teamMemberData)
      } else {
        await invite(null, teamMemberData)
      }
      await queryClient.invalidateQueries(queryKeys.teamMembers(portal?.id))
    } catch (error) {
      console.error('Error inviting team member:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
      // Owner can remove anyone except other owners
      return memberRole !== 'owner'
    }
  
    if (myRole === 'admin') {
      // Admin can remove only non-admin/non-owner (i.e. “member” role)
      return memberRole !== 'owner' && memberRole !== 'admin'
    }
  
    return false
  }
  

  return (
    <>
      <div className="flex items-center justify-between mb-4 px-6 sm:mb-6">
        <p className="text-lg font-semibold sm:text-2xl">Team Members</p>
        {(currentTeamMember?.role === 'owner' || currentTeamMember?.role === 'admin') && (
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => setIsInviteOpen(true)}
          >
            Add Member
          </Button>
        )}
      </div>

      <div className="sm:-mx-0">
        <table
          className="divide-y divide-gray-300 bg-white"
          style={{ width: 'calc(100% - 10px)' }}
        >
          <thead className="border-b border-gray-200">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900"
              >
                Name
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Role
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {teamMembers.map((member) => {
              const user = member.user || {}
              const displayName = user.name || member.name || 'Unknown'
              const displayEmail = user.email || member.email || 'Unknown'
              const avatarUrl =
                user.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`

              return (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full mr-3"
                        src={avatarUrl}
                        alt={displayName}
                      />
                      <span>{displayName}</span>
                    </div>
                    <div className="ml-11 sm:hidden">
                      <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                    </div>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    {displayEmail}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                      {member.role}
                    </span>
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    {canRemove(member.role) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="-m-2.5 inline-flex p-2.5 text-gray-500 hover:text-gray-900">
                          <span className="sr-only">Open options</span>
                          <ChevronDown className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 bg-white p-0">
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 w-full px-0">
                            <button
                              onClick={() => openRemoveDialog(member)}
                              className="w-full text-left flex items-center px-3 text-sm leading-6 text-gray-900"
                            >
                              <Trash2 className="h-5 w-5 text-red-500 mr-2" />
                              Remove
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
    </>
  )
}

export default TeamMembersTable

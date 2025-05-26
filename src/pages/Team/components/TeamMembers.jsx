import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'
import Button from '../../../components/internal/Button'
import InviteTeamMemberModal from './InviteTeamMemberModal'
import AlertDialog from '../../../components/Modal/AlertDialog'
import useTeamManagement from '../../../hooks/useTeamManagement'
import useRealtimeSeats from '../../../hooks/react-query/useRealtimeSeats'
import { useQueryClient } from 'react-query'
import { queryKeys } from '../../../hooks/react-query/queryKeys'
import { ChevronDown } from 'lucide-react'

const TeamMembers = ({ teamMembers, portal }) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const { invite, removeTeamMember, loading, } = useTeamManagement(portal);
    const { seats, isSeatLoading } = useRealtimeSeats(portal?.id);
    const [isOpen, setIsOpen] = useState(false);


    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        let { seat, ...restData } = data

        const teamMemberData = {
            portal_id: portal?.id,
            status: 'invited',
            ...restData
        }

        try {
            let availableSeat = seats.find(seat => seat.status === 'available');
            if (availableSeat) {
                await invite(availableSeat.id, teamMemberData);
                await queryClient.invalidateQueries(queryKeys.teamMembers(portal?.id));
            } else {
                console.log('No available seat. Seat is creating and inviting member....');

                const response = await invite(null, teamMemberData);
                console.log(response)
            }

        } catch (error) {
            console.log(`Error inviting team member: ${error.message}`);
        } finally {
            setIsLoading(false);
        }


    };



    console.log({
        seats
    })
    return (
        <div className="px-2 py-4 sm:px-4 sm:py-6">
            <div className='flex items-center justify-between mb-4 sm:mb-6'>
                <p className='text-lg font-semibold sm:text-2xl'>Team members</p>
                <Button onClick={() => setIsOpen(true)} >
                    Add member
                </Button>
            </div>
            <ul className="divide-y divide-gray-200">
                {teamMembers.map((member) => {
                    let userDetails = {
                        name: member?.user?.name || member?.name || 'Unknown',
                        email: member?.user?.email || member?.email || 'Unknown',
                        avatar_url: member?.user?.avatar_url || 'https://ui-avatars.com/api/?name=' + member?.user?.name
                    }
                    return (
                        <li key={member.id}>
                            <div className="py-3 sm:py-4 flex items-center">
                                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" src={userDetails.avatar_url} alt="" />
                                        <div className="ml-3 sm:ml-4">
                                            <p className="text-sm font-medium text-gray-900 sm:text-base">{userDetails.name}</p>
                                            <p className="text-xs text-gray-500 sm:text-sm">{userDetails.email}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex-shrink-0 sm:mt-0 sm:ml-5">
                                        <p className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-green-100 text-green-800   sm:leading-5">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                                <div className="ml-2 sm:ml-5 flex-shrink-0">

                                    {
                                        member?.role !== 'owner' && (
                                            <Menu as="div" className="relative inline-block text-left">

                                                <div>
                                                    <MenuButton className="rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                                                        <span className="sr-only">Open options</span>
                                                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                                                    </MenuButton>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <MenuItems className="origin-top-right absolute right-0 mt-2 w-48 sm:w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <div className="py-1">
                                                            <MenuItem>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedMember(member);
                                                                            setIsAlertOpen(true);
                                                                        }}
                                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                                            } w-full text-left block px-4 py-2 text-xs sm:text-sm`}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                )}
                                                            </MenuItem>
                                                        </div>

                                                    </MenuItems>
                                                </Transition>
                                            </Menu>
                                        )
                                    }

                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>

            <InviteTeamMemberModal
                isLoading={isLoading}
                portalId={portal?.id}
                onSubmit={onSubmit}
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                }}
            />
            <AlertDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title="Remove Member"
                message="Are you sure you want to remove this member?"
                confirmButtonText={loading ? 'Removing...' : 'Remove'}
                cancelButtonText="Cancel"
                onConfirm={async () => {
                    await removeTeamMember(selectedMember.id)
                    await queryClient.invalidateQueries(queryKeys.teamMembers(portal?.id));
                    setIsAlertOpen(false);
                }}
            />
        </div>
    )
}

export default TeamMembers
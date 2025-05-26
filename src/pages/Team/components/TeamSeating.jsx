import React, { useState } from 'react';
import { Spinner, UserPlus } from "@phosphor-icons/react";
import Button from "../../../components/internal/Button";
import InviteTeamMemberModal from "./InviteTeamMemberModal";
import { classNames } from "../../../utils/statusStyles";
import useTeamManagement from "../../../hooks/useTeamManagement";
import AlertDialog from '../../../components/Modal/AlertDialog';
import { toast } from 'react-toastify';


const TeamSeating = ({ seats, portal }) => {

    let portalId = portal?.id;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const { invite, removeTeamMember, loading, } = useTeamManagement(portal);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const seatStatuses = {
        available: 'text-green-700 bg-green-50',
        occupied: 'text-gray-600 bg-gray-50'
    };

    const onSubmit = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        let { seat, ...restData } = data

        const teamMemberData = {
            portal_id: portalId,
            status: 'invited',
            ...restData
        }




        try {
            if (selectedSeat) {
                await invite(selectedSeat.id, teamMemberData);
            } else {
                const availableSeat = seats.find(seat => seat.status === 'available');
                if (availableSeat) {
                    await invite(availableSeat.id, teamMemberData);
                } else {
                    console.log('No available seat. Seat is creating and inviting member....');
                    const response = await invite(null, teamMemberData);
                    console.log(response)
                }
            }
        } catch (error) {
            console.log(`Error inviting team member: ${error.message}`);
        } finally {
            setIsLoading(false);
        }



    }


    return (
        <>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="flex items-center justify-between px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Team Seating Arrangement</h3>
                    <Button onClick={() => setIsOpen(true)}>Add new member</Button>
                </div>
                <div className="border-t border-gray-200">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Seat</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Member</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {seats.map((seat, idx) => {
                                let memberName = seat.user?.name || seat.team_member?.name;
                                let memberImage = seat.user?.imageUrl || seat.team_member?.imageUrl || `https://ui-avatars.com/api/?name=${memberName || 'John Doe'}`;

                                return (
                                    <tr key={seat.seatNumber}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            {idx + 1}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {(seat.status === 'occupied' || seat.status === 'reserved') ? (
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img className="h-10 w-10 object-cover rounded-full" src={memberImage} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">{memberName}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Empty</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {seat.user?.role || seat.team_member?.role || '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            <span className={classNames(
                                                seatStatuses[seat.status],
                                                'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                                            )}>
                                                {seat.status}
                                            </span>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            {seat.status === 'available' ? (
                                                <button
                                                    onClick={() => {
                                                        setSelectedSeat({
                                                            ...seat,
                                                            seatNumber: idx + 1
                                                        });
                                                        setIsOpen(true);
                                                    }}
                                                    type="button"
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <UserPlus className="h-5 w-5" />
                                                    <span className="sr-only">, add member</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setIsAlertOpen(true);
                                                        setSelectedMember(seat.team_member)

                                                    }}
                                                    type="button"
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Remove
                                                    <span className="sr-only">, {memberName}</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <InviteTeamMemberModal
                isLoading={isLoading}
                portalId={portalId}
                onSubmit={onSubmit}
                selectedSeat={selectedSeat}
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setSelectedSeat(null);
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
                    setIsAlertOpen(false);
                }}
            />
        </>
    );
};

export default TeamSeating;
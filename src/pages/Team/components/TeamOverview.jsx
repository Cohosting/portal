import { Menu, Transition } from "@headlessui/react";
import { ChartBarIcon, ChevronDownIcon, UserPlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { CurrencyDollar, Desk, UserPlus, Users } from "@phosphor-icons/react";
import { Fragment, useState } from "react";

const TeamOverview = ({ companyName, teamMembers, totalSeats, filledSeats, freeSeatsLimit, additionalSeatCost }) => {

    const freeMembersLimit = 5
    const memberCount = teamMembers.length
    const paidMembersCount = Math.max(0, memberCount - freeMembersLimit)
    const freeSlots = Math.max(0, freeMembersLimit - memberCount)
    return (
        <div className="px-2 py-4 sm:px-4 sm:py-6">
            <div className="grid gap-4 mb-6 sm:gap-6 sm:mb-8 md:grid-cols-2 xl:grid-cols-4">
                <div className="flex items-center p-3 bg-white rounded-lg shadow-xs sm:p-4">
                    <div className="p-2 mr-3 text-blue-500 bg-blue-100 rounded-full sm:p-3 sm:mr-4">
                        <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
                    <div>
                        <p className="mb-1 text-xs font-medium text-gray-600 sm:mb-2 sm:text-sm">Total Members</p>
                        <p className="text-base font-semibold text-gray-700 sm:text-lg">{memberCount}</p>
                        <p className="text-xs text-gray-500 sm:text-sm">
                            {freeSlots > 0 ? `${freeSlots} free slots remaining` : `${paidMembersCount} paid members`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center p-3 bg-white rounded-lg shadow-xs sm:p-4">
                    <div className="p-2 mr-3 text-green-500 bg-green-100 rounded-full sm:p-3 sm:mr-4">
                        <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                        <p className="mb-1 text-xs font-medium text-gray-600 sm:mb-2 sm:text-sm">Admins</p>
                        <p className="text-base font-semibold text-gray-700 sm:text-lg">{teamMembers.filter(member => member.role === "admin").length}</p>
                    </div>
                </div>
                <div className="flex items-center p-3 bg-white rounded-lg shadow-xs col-span-2 sm:p-4">
                    <div className="p-2 mr-3 text-purple-500 bg-purple-100 rounded-full sm:p-3 sm:mr-4">
                        <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="w-full">
                        <p className="mb-1 text-xs font-medium text-gray-600 sm:mb-2 sm:text-sm">Team Member Usage</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-purple-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                                style={{
                                    width: `${(freeMembersLimit / freeSlots) * 100}%`
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500 sm:mt-2">
                            <span>0</span>
                            <span>{freeMembersLimit} (Free Limit)</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">
                            {paidMembersCount > 0
                                ? `Current additional cost: $${paidMembersCount * 20} /month`
                                : "You're within the free member limit"}
                        </p>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default TeamOverview;
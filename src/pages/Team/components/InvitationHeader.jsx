import React from 'react';
import { Building, UserPlus } from "@phosphor-icons/react";

const InvitationHeader = ({ inviterName, teamName, isLoggedIn, currentUserEmail, currentUserName }) => (
    <>
        <div className="text-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full inline-block">
                <UserPlus className="h-8 w-8 text-blue-500" />
            </div>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
            You're invited to join a team!
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
            <span className="font-semibold underline text-gray-800 mr-1">{inviterName}</span>
            has invited you to join their team on our platform.
        </p>
        <div className="bg-gray-50 rounded-md p-4 mb-8">
            <div className="flex items-center justify-center mb-3">
                <Building className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-semibold text-gray-700">{teamName}</span>
            </div>
            <p className="text-xs text-center text-gray-500">
                Collaborate, communicate, and achieve great things together!
            </p>
        </div>
        {isLoggedIn && (
            <div className="mb-4">
                <p className="text-sm text-gray-600">You're logged in as:</p>
                <p className="text-sm font-semibold bg-blue-100 p-2 rounded-md mt-1">{currentUserEmail}</p>
            </div>
        )}
    </>
);

export default InvitationHeader;
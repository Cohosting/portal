import React from 'react';
import { toast } from 'react-toastify';

const LogoutOtherSessions = ({ logoutOtherSessions }) => {
    const handleLogout = async () => {
        try {
            await logoutOtherSessions();
            toast.success('Successfully logged out of other sessions.');
        } catch (error) {
            toast.error('Failed to logout other sessions. Please try again.');
        }
    };

    return (
        <div className="mb-16">
            <h2 className="text-base font-semibold leading-7 text-black">Log out other sessions</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
                Log out of your account on other devices.
            </p>

            <div className="mt-6">
                <button
                    onClick={handleLogout}
                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Log out other sessions
                </button>
            </div>
        </div>
    );
};


export default LogoutOtherSessions;
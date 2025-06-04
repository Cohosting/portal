import { Button } from '@/components/ui/button';
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
        <div className="mb-8">
            <h2 className="text-base font-semibold leading-7 text-black">Log out other sessions</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
                Log out of your account on other devices.
            </p>

            <div className="mt-6">
                <Button
                    onClick={handleLogout}
                    className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                    Log out other sessions
                </Button>
            </div>
        </div>
    );
};


export default LogoutOtherSessions;
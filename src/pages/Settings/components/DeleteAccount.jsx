import React from 'react';
import { toast } from 'react-toastify';

const DeleteAccount = ({ deleteAccount }) => {
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await deleteAccount();
                toast.success('Account deleted successfully.');
            } catch (error) {
                toast.error('Failed to delete account. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2 className="text-base font-semibold leading-7 text-black">Delete account</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
                No longer want to use our service? You can delete your account here. This action is not reversible.
                All information related to this account will be deleted permanently.
            </p>

            <div className="mt-6">
                <button
                    onClick={handleDelete}
                    className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
                >
                    Yes, delete my account
                </button>
            </div>
        </div>
    );
};

export default DeleteAccount;
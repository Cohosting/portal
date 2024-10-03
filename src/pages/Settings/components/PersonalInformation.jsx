
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from '../../../hooks/useForm';
import AvatarUpload from './AvatarUpload';

const PersonalInformation = ({ user, updateProfile }) => {

    const firstName = user?.name?.split(' ')[0] || '';
    const lastName = user?.name?.split(' ')[1] || '';

    const [isEditing, setIsEditing] = useState(false);
    const { values, handleChange, resetForm } = useForm({
        firstName: firstName,
        lastName: lastName,
        email: user?.email || '',
    });

    useEffect(() => {
        if (
            values.firstName !== firstName ||
            values.lastName !== lastName ||
            values.email !== user?.email
        ) {
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [values, firstName, lastName, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({
                name: `${values.firstName} ${values.lastName}`,
            });
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile. Please try again.');
            console.log(error);
        }
    };



    return (
        <div className="mb-16">
            <h2 className="text-base font-semibold leading-7 text-black">Personal Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">Use a permanent address where you can receive mail.</p>

            <form onSubmit={handleSubmit} className="mt-6">
                <div className='mb-8'>

                    <AvatarUpload user={user} />
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-black">
                            First name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="first-name"
                            value={values.firstName}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-black">
                            Last name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="last-name"
                            value={values.lastName}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-black">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={values.email}
                            readOnly
                            onChange={handleChange}
                            className="mt-2 block w-full cursor-not-allowed rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-8 flex">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-md mr-2 bg-gray-200 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                            Save
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default PersonalInformation;
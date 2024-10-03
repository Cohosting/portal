import React from 'react'
import { toast } from 'react-toastify';
import { useForm } from '../../../hooks/useForm';

const ChangePassword = ({ changePassword }) => {
    const { values, handleChange, resetForm } = useForm({
        newPassword: '',
        confirmPassword: '',
    });
    const { newPassword, confirmPassword } = values

    const handleSubmit = async (e) => {
        console.log(`s`)
        e.preventDefault();
        if (!values.newPassword || !values.confirmPassword) {
            console.log(`empty values`)
            return;
        }
        console.log(`newPassword: ${newPassword}`)
        console.log(`confirmPassword: ${confirmPassword}`)
        if (values.newPassword !== values.confirmPassword) {

            toast.error('New passwords do not match.');
            return;
        }
        console.log(`values.newPassword: ${values.newPassword}`)
        console.log(`values.confirmPassword: ${values.confirmPassword}`)
        try {
            await changePassword(values.newPassword);
            toast.success('Password changed successfully!');
            resetForm();
        } catch (error) {
            let errorMessage = error.message;
            if (error.message !== 'New password should be different from the old password.') {
                errorMessage = 'Failed to change password. Please try again.';
            }
            toast.error(errorMessage);
            console.log(error.message);
        }
    };
    let isEmpty = !newPassword || !confirmPassword

    return (
        <div className="mb-16">
            <h2 className="text-base font-semibold leading-7 text-black">Change password</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
                Update your password associated with your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">


                    <div className="col-span-full">
                        <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-black">
                            New password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            id="new-password"
                            value={values.newPassword}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-black">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirm-password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            className="mt-2 block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div className="mt-8 flex">
                    <button

                        type="submit"
                        className={`rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${(isEmpty || newPassword !== confirmPassword) && 'opacity-50 cursor-not-allowed'}`}
                    >
                        Change password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword
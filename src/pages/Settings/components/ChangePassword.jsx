import React from 'react';
import { toast } from 'react-toastify';
import { useForm } from '../../../hooks/useForm';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ChangePassword = ({ changePassword }) => {
  const { values, handleChange, resetForm } = useForm({
    newPassword: '',
    confirmPassword: '',
  });
  const { newPassword, confirmPassword } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    try {
      await changePassword(newPassword);
      toast.success('Password changed successfully!');
      resetForm();
    } catch (error) {
      let errorMessage = error.message;
      if (error.message !== 'New password should be different from the old password.') {
        errorMessage = 'Failed to change password. Please try again.';
      }
      toast.error(errorMessage);
      console.error(error.message);
    }
  };

  const isEmpty = !newPassword || !confirmPassword;
  const passwordsMismatch = newPassword !== confirmPassword;

  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold leading-7 text-black">Change password</h2>
      <p className="mt-1 text-sm leading-6 text-gray-400">
        Update your password associated with your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:max-w-xl sm:grid-cols-6">
          <div className="col-span-full">
            <Label htmlFor="new-password">New password</Label>
            <Input
              type="password"
              name="newPassword"
              id="new-password"
              value={newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-2"
            />
          </div>

          <div className="col-span-full">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-2"
            />
          </div>
        </div>

        <div className="mt-4">
          <Button
          className='bg-black text-white hover:bg-gray-800'
            type="submit"
            disabled={isEmpty || passwordsMismatch}
          >
            Change password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from '../../../hooks/useForm';
import AvatarUpload from './AvatarUpload';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

const PersonalInformation = ({ user, updateProfile }) => {
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      await updateProfile({
        name: `${values.firstName} ${values.lastName}`,
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error(error);
     } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold leading-7 text-black">
        Personal Information
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-400">
        Use a permanent address where you can receive mail.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-8">
          <AvatarUpload user={user} />
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Label htmlFor="first-name">First name</Label>
            <Input
              type="text"
              name="firstName"
              id="first-name"
              value={values.firstName}
              onChange={handleChange}
              placeholder="John"
              className="mt-2"
            />
          </div>

          <div className="sm:col-span-3">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              type="text"
              name="lastName"
              id="last-name"
              value={values.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="mt-2"
            />
          </div>

          <div className="col-span-full">
            <Label htmlFor="email">Email address</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={values.email}
              readOnly
              onChange={handleChange}
              className="mt-2 cursor-not-allowed"
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 flex space-x-2">
            <Button
              variant="outline"
              type="button"
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button className='bg-black text-white hover:bg-gray-800' type="submit">
              {loading ? (
                <>
                 <p>Saving changes...</p>
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalInformation;

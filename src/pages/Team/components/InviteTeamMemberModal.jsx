import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { supabase } from '../../../lib/supabase';
import { Loader, UserPlus, X } from 'lucide-react';

const InviteTeamMemberModal = ({ isOpen, onClose, onSubmit, selectedSeat = null, isLoading }) => {
  const [formData, setFormData] = useState({ email: '', role: 'member', name: '' });
  const [error, setError] = useState('');
  const [emailState, setEmailState] = useState({
    isValid: false,
    isChecking: false,
    isExisting: false,
    checkComplete: false,
  });
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (selectedSeat !== null) {
      setFormData(prev => ({ ...prev, seat: selectedSeat }));
    }
  }, [selectedSeat]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const checkExistingUser = useCallback(async (email) => {
    if (!email) return;
    setEmailState(prev => ({ ...prev, isChecking: true, isExisting: false, checkComplete: false }));
    setFormData(prev => ({ ...prev, name: '' }));

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .eq('email', email)
        .single();

      if (error?.code === 'PGRST116') {
        setEmailState(prev => ({ ...prev, isExisting: false, checkComplete: true }));
      } else {
        setEmailState(prev => ({ ...prev, isExisting: !!data, checkComplete: true }));
        if (data?.name) {
          setFormData(prev => ({ ...prev, name: data.name }));
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setError('Error checking user. Please try again.');
      setEmailState(prev => ({ ...prev, checkComplete: true }));
    } finally {
      setEmailState(prev => ({ ...prev, isChecking: false }));
    }
  }, []);

  const handleEmailChange = useCallback((e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, email: value }));

    if (!value.trim()) {
      setError('Email cannot be blank.');
      setEmailState({ isValid: false, isChecking: false, isExisting: false, checkComplete: false });
      return;
    }

    const isValid = validateEmail(value);

    setEmailState(prev => ({ ...prev, isValid, checkComplete: false }));

    if (isValid) {
      setError('');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => checkExistingUser(value), 300);
    } else {
      setError('Please enter a valid email.');
      setEmailState(prev => ({ ...prev, isChecking: false, isExisting: false, checkComplete: false }));
    }
  }, [checkExistingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email.trim() || !emailState.isValid) {
      setError('Please enter a valid email.');
      return;
    }
    if (!emailState.isExisting && !formData.name.trim()) {
      setError('Please enter a name for the new user.');
      return;
    }
    await onSubmit(formData);
    onClose();
  };

  const resetOnClose = () => {
    setFormData({ email: '', role: 'member', name: '' });
    setError('');
    setEmailState({ isValid: false, isChecking: false, isExisting: false, checkComplete: false });
    onClose();
  };

  const renderAdditionalFields = () => {
    if (!emailState.isValid || emailState.isChecking || !emailState.checkComplete) return null;

    return (
      <>
        {!emailState.isExisting && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Access Level</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </>
    );
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={resetOnClose} className="relative z-50">
        <TransitionChild as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between">
                  <span className="flex items-center">
                    <UserPlus className="mr-2 h-5 w-5 text-indigo-600" />
                    {selectedSeat ? `Assign Member to Seat ${selectedSeat.seatNumber}` : 'Invite Team Member'}
                  </span>
                  <button
                    onClick={resetOnClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label="Close"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </DialogTitle>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleEmailChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${emailState.isValid && emailState.checkComplete ? 'border-green-500' : error ? 'border-red-500' : ''
                          }`}
                        required
                      />
                      {emailState.isChecking && <p className="text-sm text-gray-500 mt-1">Checking user...</p>}
                      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
                    </div>
                    {renderAdditionalFields()}
                  </div>
                  <div className="mt-6 flex items-center justify-end">
                    <button
                      type="submit"
                      className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!emailState.isValid || emailState.isChecking || !emailState.checkComplete || isLoading}
                    >
                      {selectedSeat ? 'Assign to Seat' : 'Send Invitation'}
                      {isLoading && <Loader className="w-4 h-4 ml-2 animate-spin" />}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InviteTeamMemberModal;

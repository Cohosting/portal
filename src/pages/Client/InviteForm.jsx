import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';
import { registerClientWithStripe } from '../../services/stripeConnect';

const InputField = ({ id, name, type, placeholder, label, errorMessage, value, required, handleChange, showError }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      required={required}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    />
    {showError && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}
  </div>
);

export const InviteForm = ({
  isOpen,
  onClose,
  onToggleSuccess,
  setTemporaryClient,
  isEditing = false,
  clientToEdit = null,
}) => {
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const { currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const [inviteState, setInviteState] = useState({
    email: clientToEdit?.email || '',
    name: clientToEdit?.name || '',
  });
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    name: '',
  });

  const handleChange = e => {
    let value = e.target.value;
    if (e.target.name === 'email') {
      value = value.trim();
    }
    setInviteState({
      ...inviteState,
      [e.target.name]: value,
    });
    // Clear validation error when user starts typing
    setValidationErrors({
      ...validationErrors,
      [e.target.name]: '',
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', name: '' };

    if (!inviteState.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!isEditing) {
      if (!inviteState.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteState.email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    setValidationErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    setAttemptedSubmit(true);
    if (validateForm()) {
      if (isEditing) {
        await updateClient();
      } else {
        await addNewClientToPortal();
      }
    }
  };

  const updateClient = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .update({ name: inviteState.name })
        .eq('id', clientToEdit.id)
        .select()
        .single();

      if (error) throw error;

      setTemporaryClient(data);
      onClose();
      onToggleSuccess();
    } catch (err) {
      console.error('Error updating client:', err.message);
      setIsError('Failed to update client');
    } finally {
      setIsLoading(false);
    }
  };

  const addNewClientToPortal = async () => {
    setIsLoading(true);

    try {
      const { data: existingClient, error: checkError } = await supabase
        .from('clients')
        .select('*')
        .eq('portal_id', portal.id)
        .eq('email', inviteState.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingClient) {
        setIsError('Client already exists');
        return;
      }

      const stripeCustomer = await registerClientWithStripe(
        inviteState.email,
        null,
        portal.stripe_connect_account_id
      );

      const { data: insertedClient, error: insertError } = await supabase
        .rpc('register_client_in_portal', {
          p_email: inviteState.email,
          p_name: inviteState.name,
          p_portal_id: portal.id,
          p_stripe_customer_id: stripeCustomer.id
        });

      if (insertError) throw insertError;

      setTemporaryClient(insertedClient);
      onClose();
      onToggleSuccess(insertedClient);
    } catch (err) {
      console.error('Error in addNewClientToPortal:', err);
      setIsError(err.message);

      if (err.stripeCustomerId) {
        console.error(`Orphaned Stripe customer created: ${err.stripeCustomerId}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditing && clientToEdit) {
      setInviteState({
        email: clientToEdit.email,
        name: clientToEdit.name,
      });
    }
  }, [isEditing, clientToEdit]);

  useEffect(() => {
    // Reset error states and attempted submit when modal is opened
    if (isOpen) {
      setIsError(null);
      setAttemptedSubmit(false);
      setValidationErrors({ email: '', name: '' });
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {isEditing ? 'Edit Client' : 'Add New Client'}
                </Dialog.Title>
                <p className="text-sm text-gray-500 mt-2">
                  {isEditing ? "Update the client's name." : "Provide the client's email and name."}
                </p>

                <div className="mt-4 space-y-4">
                  <InputField
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Name"
                    label="Name"
                    errorMessage={validationErrors.name}
                    value={inviteState.name}
                    required
                    handleChange={handleChange}
                    showError={attemptedSubmit && validationErrors.name}
                  />
                  {!isEditing && (
                    <InputField
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email"
                      label="Email"
                      errorMessage={validationErrors.email}
                      value={inviteState.email}
                      required
                      handleChange={handleChange}
                      showError={attemptedSubmit && validationErrors.email}
                    />
                  )}
                </div>

                {isError && (
                  <p className="mt-2 text-sm text-red-600">{isError}</p>
                )}

                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    onClick={handleSubmit}
                  >
                    {isLoading ? 'Saving...' : (isEditing ? 'Save' : 'Add')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
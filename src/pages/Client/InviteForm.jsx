import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';
import { registerClientWithStripe } from '../../services/stripeConnect';
import InputField from '../../components/InputField';

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
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal)
  const [inviteState, setInviteState] = useState({
    email: clientToEdit?.email || '',
    name: clientToEdit?.name || '',
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
  };

  const handleSubmit = async () => {
    if (isEditing) {
      await updateClient();
    } else {
      await addNewClientToPortal();
    }
  };

  const updateClient = async () => {
    if (!inviteState.name) {
      setIsError('Please enter a valid name');
      return;
    }

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
    // Validate input
    if (!inviteState.email || !inviteState.name) {
      setIsError('Please enter a valid email and name');
      return;
    }

    setIsLoading(true);

    try {
      // Check if client already exists
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


      // Register with Stripe first
      const stripeCustomer = await registerClientWithStripe(
        inviteState.email,
        null, // We don't have a client ID yet
        portal.stripe_connect_account_id
      );

      console.log({
        p_email: inviteState.email,
        p_name: inviteState.name,
        p_portal_id: portal.id,
        p_stripe_customer_id: stripeCustomer.id,
        stripeCustomer
      })
      // If Stripe registration is successful, proceed with database operations using RPC
      const { data: insertedClient, error: insertError } = await supabase
        .rpc('register_client_in_portal', {
          p_email: inviteState.email,
          p_name: inviteState.name,
          p_portal_id: portal.id,
          p_stripe_customer_id: stripeCustomer.id
        });

      if (insertError) throw insertError;

      // Finalize operation
      setTemporaryClient(insertedClient);
      onClose();
      onToggleSuccess(insertedClient);
    } catch (err) {
      console.error('Error in addNewClientToPortal:', err);
      setIsError(err.message);

      // If we've created a Stripe customer but failed to add to our database,
      // we should log this for manual cleanup
      if (err.stripeCustomerId) {
        console.error(`Orphaned Stripe customer created: ${err.stripeCustomerId}`);
        // Here you could also add this to a separate 'cleanup' table in your database
        // or trigger a notification to your support team
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

  console.log(portal);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <p className='text-base font-semibold leading-6 text-gray-900'>
            {isEditing ? 'Edit Client' : 'Add New Client'}
          </p>
          <Text className='font-normal text-sm mt-1'>
            {isEditing ? "Update the client's name." : "Provide the client's email and name."}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch">
            <Box>
              <InputField
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                label="Name"
                errorMessage="Please enter a valid name"
                value={inviteState.name}
                required
                handleChange={handleChange}
              />
            </Box>
            {!isEditing && (
              <Box>
                <InputField
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  label="Email"
                  errorMessage="Please enter a valid email address"
                  value={inviteState.email}
                  required
                  handleChange={handleChange}
                />
              </Box>
            )}
          </VStack>
          {isError && (
            <p className='error-text mt-2'>{isError}</p>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant={'ghost'} onClick={onClose}>
            Close
          </Button>
          <button onClick={handleSubmit} className='btn-indigo w-[5.5rem]'>
            {isLoading ? 'Saving...' : (isEditing ? 'Save' : 'Add')}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

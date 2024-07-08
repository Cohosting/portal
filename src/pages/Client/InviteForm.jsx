
import { Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react';

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
}) => {
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals)
  const [inviteState, setInviteState] = useState({
    email: '',
    name: '',
  });

  const handleChange = e => {
    setInviteState({
      ...inviteState,
      [e.target.name]: e.target.value,
    });
  };

  const addNewClientToPortal = async () => {

    // validate input
    if (!inviteState.email || !inviteState.name) {
      setIsError('Please enter a valid email and name');
      return;
    }
    try {
      setIsLoading(true);
      console.log('Starting to add new client to portal');

      console.log(`Checking if client with email ${inviteState.email} already exists in portal ${portal.id}`);
      const { data: clientData, error: memberError } = await supabase
        .from('clients')
        .select('*')
        .eq('portal_id', portal.id)
        .eq('email', inviteState.email);

      if (memberError) {
        console.error('Error checking for existing client:', memberError);
        throw memberError;
      }

      if (clientData && clientData.length > 0) {
        console.log('Client already exists. Aborting operation.');
        setIsError('Client already exists');
        setIsLoading(false);
        return;
      }

      // Prepare new client data
      console.log('Preparing new client data');
      const newClient = {
        ...inviteState,
        status: 'restricted',
        portal_id: portal.id,
      };

      // Add new member
      console.log('Adding new client to the database');
      const { data: insertedClient, error: insertError } = await supabase
        .from('clients')
        .insert([newClient])
        .select('*')
        .single();

      if (insertError) {
        console.error('Error inserting new client:', insertError);
        throw insertError;
      }

      // Update portal's member list
      console.log(`Updating portal ${portal.id} members list with new client ${insertedClient.id}`);
      const { error: updateError } = await supabase
        .rpc('add_member_to_portal', {
          portal_id: portal.id,
          member_id: insertedClient.id
      });


      if (updateError) {
        console.error('Error updating portal members list:', updateError);
        throw updateError;
      }

      // Register client with Stripe
      console.log(`Registering client ${insertedClient.id} with Stripe`);
      await registerClientWithStripe(insertedClient.email, insertedClient.id, portal.stripe_connect_account_id);

      // Finalize operation
      console.log('Client added successfully. Finalizing operation.');
      setTemporaryClient(insertedClient);
      onClose();
      onToggleSuccess();
      setIsLoading(false);
    } catch (err) {
      console.error('An error occurred during the addNewClientToPortal operation:', err.message);
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {/* modal header text style */}
          <p className=' text-base font-semibold leading-6 text-gray-900 ' >Add New Client</p>
          <Text className=' font-normal  text-sm mt-1 ' >Provide the client's email and name.</Text>

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

          </VStack>
          {isError && (
            <p className='error-text mt-2' >{isError}</p>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant={'ghost'} onClick={onClose}>
            Close
          </Button>
          <button onClick={addNewClientToPortal} className='btn-indigo w-[5.5rem]'>
            {isLoading ? 'Adding...' : 'Add'}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

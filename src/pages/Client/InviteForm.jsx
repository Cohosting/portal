import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { supabase } from '../../lib/supabase';
import { registerClientWithStripe } from '../../services/stripeConnect';

// Import shadcn components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
 
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
    let email = inviteState.email.trim();
  
    try {
      const { data: existingClient, error: checkError } = await supabase
        .from('clients')
        .select('*')
        .eq('portal_id', portal.id)
        .eq('email', email)
        .single();
  
      // PGRST116 means “no rows found.” If we get a different error, bail out.
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
  
      if (existingClient) {
        if (!existingClient.is_deleted) {
          setIsError('Client already exists');
          return;
        }

        const { data: restoredClient, error: restoreError } = await supabase
          .from('clients')
          .update({
            is_deleted: false,
            status: 'pending',
            name: inviteState.name,
            activated_at: new Date().toISOString(),
            invitation_token: null,
            token_expires_at: null,
            token_used: false,
          })
          .eq('id', existingClient.id)
          .select()
          .single();
  
        if (restoreError) throw restoreError;
        console.log({restoredClient})

  
        setTemporaryClient(restoredClient);
        onClose();
        onToggleSuccess(restoredClient);
        return;
      }
 
      const stripeCustomer = await registerClientWithStripe(
        email,
        null,
        portal.stripe_connect_account_id
      );
  
      const { data: insertedClient, error: insertError } = await supabase
        .rpc('register_client_in_portal', {
          p_email: email,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white ">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the client's name." : "Provide the client's email and name."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              value={inviteState.name}
              onChange={handleChange}
              className={attemptedSubmit && validationErrors.name ? "border-red-500" : ""}
            />
            {attemptedSubmit && validationErrors.name && (
              <p className="text-sm text-red-500">{validationErrors.name}</p>
            )}
          </div>

          {!isEditing && (
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={inviteState.email}
                onChange={handleChange}
                className={attemptedSubmit && validationErrors.email ? "border-red-500" : ""}
              />
              {attemptedSubmit && validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>
          )}
        </div>

        {isError && (
          <p className="text-sm text-red-500">{isError}</p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-black text-white hover:bg-gray-800" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Save' : 'Add')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
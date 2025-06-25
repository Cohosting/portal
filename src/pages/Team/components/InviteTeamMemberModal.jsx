import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { supabase } from '../../../lib/supabase';
import { Loader, UserPlus } from 'lucide-react';

const InviteTeamMemberModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedSeat = null,
  isLoading,
  currentTeamMember,
  teamMembers = [],
}) => {
  // Only owners and admins may invite new members
  const isAllowedToInvite = ['owner', 'admin'].includes(currentTeamMember?.role);

  if (!isAllowedToInvite) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-6 bg-white">
          <DialogHeader>
            <DialogTitle>Not Authorized</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-gray-700">
            Only Owners or Admins may invite new team members.
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const [formData, setFormData] = useState({ email: '', role: 'member', name: '' });
  const [error, setError] = useState('');
  const [emailState, setEmailState] = useState({
    isValid: false,
    isChecking: false,
    isExisting: false,
    isTeamMember: false,
    checkComplete: false,
  });
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (selectedSeat !== null) {
      setFormData((prev) => ({ ...prev, seat: selectedSeat }));
    }
  }, [selectedSeat]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const checkExistingUser = useCallback(
    async (email) => {
      if (!email) return;

      // Before checking Supabase, see if the email is already a team member
      const normalized = email.trim().toLowerCase();
      const alreadyOnTeam = teamMembers.some(
        (member) => member.email.trim().toLowerCase() === normalized
      );

      if (alreadyOnTeam) {
        setEmailState((prev) => ({
          ...prev,
          isChecking: false,
          isExisting: false,
          isTeamMember: true,
          checkComplete: true,
        }));
        setError('This user is already a member of the team.');
        setFormData((prev) => ({ ...prev, name: '' }));
        return;
      }

      setEmailState((prev) => ({
        ...prev,
        isChecking: true,
        isExisting: false,
        isTeamMember: false,
        checkComplete: false,
      }));
      setFormData((prev) => ({ ...prev, name: '' }));
      setError('');

      try {
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('id, name')
          .eq('email', normalized)
          .single();

        if (fetchError?.code === 'PGRST116') {
          // No matching user
          setEmailState((prev) => ({
            ...prev,
            isExisting: false,
            checkComplete: true,
          }));
        } else {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (data?.id === user?.id) {
            setError('You cannot invite yourself.');
            setEmailState((prev) => ({
              ...prev,
              isExisting: false,
              checkComplete: true,
            }));
            return;
          }

          setEmailState((prev) => ({
            ...prev,
            isExisting: !!data,
            checkComplete: true,
          }));

          if (data?.name) {
            setFormData((prev) => ({ ...prev, name: data.name }));
          }
        }
      } catch (err) {
        console.error('Error checking user:', err);
        setError('Error checking user. Please try again.');
        setEmailState((prev) => ({
          ...prev,
          checkComplete: true,
        }));
      } finally {
        setEmailState((prev) => ({
          ...prev,
          isChecking: false,
        }));
      }
    },
    [teamMembers]
  );

  const handleEmailChange = useCallback(
    (e) => {
      // Strip all whitespace characters from the input
      const raw = e.target.value;
      const value = raw.replace(/\s+/g, '');
      setFormData((prev) => ({ ...prev, email: value }));
      setError('');

      if (!value) {
        setError('Email cannot be blank.');
        setEmailState({
          isValid: false,
          isChecking: false,
          isExisting: false,
          isTeamMember: false,
          checkComplete: false,
        });
        return;
      }

      const isValid = validateEmail(value);
      setEmailState((prev) => ({
        ...prev,
        isValid,
        isTeamMember: false,
        checkComplete: false,
      }));

      if (isValid) {
        // Debounce existing checks
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => checkExistingUser(value), 300);
      } else {
        setError('Please enter a valid email.');
        setEmailState({
          isValid: false,
          isChecking: false,
          isExisting: false,
          isTeamMember: false,
          checkComplete: false,
        });
      }
    },
    [checkExistingUser]
  );

  const preventSpace = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = (e.clipboardData || window.clipboardData).getData('text');
    const sanitized = pasteData.replace(/\s+/g, '');
    setFormData((prev) => ({ ...prev, email: sanitized }));
    setError('');

    if (!sanitized) {
      setError('Email cannot be blank.');
      setEmailState({
        isValid: false,
        isChecking: false,
        isExisting: false,
        isTeamMember: false,
        checkComplete: false,
      });
      return;
    }

    const isValid = validateEmail(sanitized);
    setEmailState((prev) => ({
      ...prev,
      isValid,
      isTeamMember: false,
      checkComplete: false,
    }));

    if (isValid) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => checkExistingUser(sanitized), 300);
    } else {
      setError('Please enter a valid email.');
      setEmailState({
        isValid: false,
        isChecking: false,
        isExisting: false,
        isTeamMember: false,
        checkComplete: false,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAllowedToInvite) {
      setError('You are not permitted to send invitations.');
      return;
    }

    if (!formData.email || !emailState.isValid) {
      setError('Please enter a valid email.');
      return;
    }

    // Final check: is the email already on the team?
    const normalized = formData.email.trim().toLowerCase();
    const alreadyOnTeam = teamMembers.some(
      (member) => member.email.trim().toLowerCase() === normalized
    );
    if (alreadyOnTeam) {
      setError('This user is already a member of the team.');
      return;
    }

    if (!emailState.isExisting && !formData.name.trim()) {
      setError('Please enter a name for the new user.');
      return;
    }

    await onSubmit(formData);
    setFormData({ email: '', role: 'member', name: '' });
    onClose();
  };

  const resetOnClose = () => {
    setFormData({ email: '', role: 'member', name: '' });
    setError('');
    setEmailState({
      isValid: false,
      isChecking: false,
      isExisting: false,
      isTeamMember: false,
      checkComplete: false,
    });
    onClose();
  };

  const renderAdditionalFields = () => {
    if (
      !emailState.isValid ||
      emailState.isChecking ||
      !emailState.checkComplete ||
      emailState.isTeamMember
    ) {
      return null;
    }

    return (
      <div className="space-y-4">
        {!emailState.isExisting && (
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-gray-300 focus:ring-gray-500 focus:border-gray-500"
              required
            />
          </div>
        )}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-2 block" htmlFor="role">
            Access Level
          </Label>
          <Select
            value={formData.role}
            onValueChange={(val) => setFormData((prev) => ({ ...prev, role: val }))}
          >
            <SelectTrigger
              id="role"
              name="role"
              className="border-gray-300 focus:ring-gray-500 focus:border-gray-500"
            >
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetOnClose}>
      <DialogContent className="max-w-md p-6 bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-lg font-medium text-gray-900">
              <UserPlus className="mr-2 h-5 w-5" />
              {selectedSeat ? `Assign Member to Seat ${selectedSeat.seatNumber}` : 'Invite Team Member'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block" htmlFor="email">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleEmailChange}
              onKeyDown={preventSpace}
              onPaste={handlePaste}
              className={`
                border-gray-300 focus:ring-gray-500 focus:border-gray-500
                ${
                  emailState.isValid && emailState.checkComplete && !emailState.isTeamMember
                    ? 'border-green-500'
                    : error
                    ? 'border-red-500'
                    : ''
                }
              `}
              required
            />
            {emailState.isChecking && <p className="mt-1 text-sm text-gray-500">Checking user…</p>}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {renderAdditionalFields()}

          <DialogFooter className="flex justify-end">
            <Button
              type="submit"
              className={`
                bg-gray-900 text-white hover:bg-gray-700
                ${
                  (!emailState.isValid ||
                    emailState.isChecking ||
                    !emailState.checkComplete ||
                    emailState.isTeamMember ||
                    isLoading) &&
                  'opacity-50 cursor-not-allowed'
                }
              `}
              disabled={
                !emailState.isValid ||
                emailState.isChecking ||
                !emailState.checkComplete ||
                emailState.isTeamMember ||
                isLoading
              }
            >
              {selectedSeat ? 'Assign to Seat' : 'Send Invitation'}
              {isLoading && <Loader className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteTeamMemberModal;
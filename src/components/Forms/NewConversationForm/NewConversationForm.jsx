// src/components/NewConversationForm.jsx
import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import PeopleMultiSelectWithAvatar from "../../internal/PeopleMultiSelectWithAvatar";
import { useSelector } from "react-redux";
import { createConversation } from "../../../services/chat";
import { usePortalClients, usePortalData } from "../../../hooks/react-query/usePortalData";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTeamMembers } from "@/hooks/react-query/useTeamMembers";
 
const NewConversationForm = ({ onClose }) => {
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [conversationName, setConversationName] = useState("");

  const { currentSelectedPortal, user } = useSelector((state) => state.auth);
  // if you store the user in Redux, grab it; otherwise use supabase.auth.user()
  const currentUserId = user?.id;

  const { data: portal, isLoading: portalLoading } = usePortalData(currentSelectedPortal);
  const { data: clients, isLoading: clientsLoading } = usePortalClients(currentSelectedPortal);
  const { data: teamMembers, isLoading: teamMembersLoading } = useTeamMembers(currentSelectedPortal, {
    status: 'active'
  });
  console.log({
    teamMembers,
    currentUserId
  })

  // Filter out current user from team members to avoid duplicates
  const availableTeamMembers = teamMembers?.filter(member => member?.id !== currentUserId) || [];

  // Memoized handlers
  const handleClientsChange = useCallback((selected) => {
    setSelectedClients(selected);
  }, []);

  const handleTeamMembersChange = useCallback((selected) => {
    setSelectedTeamMembers(selected);
  }, []);

  const handleNameChange = useCallback((e) => {
    setConversationName(e.target.value);
  }, []);

  const handleCreateConversation = async () => {
    const totalParticipants = selectedClients.length + selectedTeamMembers.length;
    
    if (totalParticipants === 0) {
      toast.error("Please select at least one client or team member.");
      return;
    }
    
    if (!conversationName.trim() && totalParticipants > 1) {
      toast.error("Please enter a conversation name.");
      return;
    }

    setIsCreating(true);
    try {
      const name =
        totalParticipants > 1
          ? `${conversationName.trim()}`
          : portal.brand_settings.brandName;

      // Build participants array with correct type mapping
      const participants = [];
      
      // 1) Add selected clients with type "clients"
      selectedClients.forEach((client) => {
        participants.push({
          type: "clients",
          id: client.id,
        });
      });

      // 2) Add selected team members with type "users"
      selectedTeamMembers.forEach((teamMember) => {
        participants.push({
          type: "users",
          id: teamMember.user_id
        });
      });

      // 3) Add the current user
      participants.push({
        type: "users",
        id: currentUserId,
      });

      const newConversationId = await createConversation(
        { name, portal_id: currentSelectedPortal },
        participants
      );

      toast.success("Conversation created!");
      onClose();
      console.log("New conversation created with ID:", newConversationId);
    } catch (err) {
      console.error("Error creating conversation:", err);
      toast.error(
        err?.message
          ? `Failed to create conversation: ${err.message}`
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (portalLoading || clientsLoading || teamMembersLoading) {
    return (
      <div className="flex items-center justify-center py-2 text-black">
        Loading...
      </div>
    );
  }

  // Determine if conversation name is required
  const totalParticipants = selectedClients.length + selectedTeamMembers.length;
  const isNameRequired = totalParticipants > 1;
  const isFormValid = totalParticipants > 0 && (!isNameRequired || conversationName.trim());

  return (
    <>
      <div>
        <div className="mb-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900 mb-2">
            New Conversation
          </h3>
          <p className="text-sm text-gray-500">
            Create a conversation including yourself and the selected participants
          </p>
        </div>

        <PeopleMultiSelectWithAvatar
          people={clients || []}
          onChange={handleClientsChange}
          value={selectedClients}
          label="Select client(s)"
        />

        <div className="mt-4">
          <PeopleMultiSelectWithAvatar
            people={availableTeamMembers || []}
            onChange={handleTeamMembersChange}
            value={selectedTeamMembers}
            label="Select team member(s)"
          />
        </div>

        {totalParticipants > 1 && (
          <div className="mt-4">
            <Label htmlFor="conversation-name" className="block text-sm font-medium text-gray-700">
              Conversation Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="conversation-name"
              type="text"
              value={conversationName}
              onChange={handleNameChange}
              placeholder="Enter conversation name..."
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required={isNameRequired}
            />
            <p className="mt-1 text-xs text-gray-500">
              Required for group conversations
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3 space-y-3 sm:space-y-0">
        <Button 
          className="w-full" 
          size="lg" 
          onClick={onClose} 
          variant="outline"
          type="button"
          disabled={isCreating}
        >
          Cancel
        </Button>

        <Button
          className="w-full bg-gray-900 text-white"
          size="lg"
          variant="default"
          data-autofocus
          onClick={handleCreateConversation}
          disabled={isCreating || !isFormValid}
          type="button"
        >
          {isCreating ? "Creating..." : "Create"}
        </Button>
      </div>
    </>
  );
};

export default NewConversationForm;
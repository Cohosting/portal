import React, { useState, useCallback } from "react";
import { DialogTitle } from "@headlessui/react";
import PeopleMultiSelectWithAvatar from "../../internal/PeopleMultiSelectWithAvatar";
import { usePortalClients } from "../../../hooks/react-query/usePortalData";
import { useSelector } from "react-redux";
import { createMassMessage } from "../../../services/chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "../../../lib/supabase";

const MassMessageForm = ({ onClose }) => {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [comment, setComment] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: clients, isLoading } = usePortalClients(currentSelectedPortal);

  // Simplified handler that just sets the new value
  const handleChange = useCallback((selected) => {
    setSelectedPeople(selected);
  }, []);

  const handleCommentChange = useCallback((e) => {
    setComment(e.target.value);
  }, []);

  const handleMassMessageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPeople.length || !comment.trim()) return;

    setIsCreating(true);
    try {
      const messageData = {
        content: comment,
        status: "sent",
      };
      const participantIds = selectedPeople.map(p => p.id);

      await createMassMessage(
        messageData,
        participantIds,
        currentSelectedPortal,
        user.id
      );

      onClose();
    } catch (err) {
      console.error("Error sending mass messages:", err);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-2 text-black">Loading...</div>;
  }

  return (
    <form onSubmit={handleMassMessageSubmit}>
      <div className="mb-6">
        <DialogTitle className="text-base font-semibold leading-6 text-black mb-2">
          Mass Message
        </DialogTitle>
        <p className="text-sm text-black">
          Send a direct message to multiple clients. Recipients cannot see each others' replies.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="comment">Message</Label>
          <Textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={handleCommentChange}
            placeholder="Enter your message here..."
          />
        </div>

        <PeopleMultiSelectWithAvatar
          people={clients || []}
          onChange={handleChange}
          value={selectedPeople}
          label="Select client(s)"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          onClick={onClose} 
          disabled={isCreating}
          type="button"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isCreating || !selectedPeople.length || !comment.trim()} 
          className="bg-black text-white"
        >
          {isCreating ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  );
};

export default MassMessageForm
import { useState } from "react";
import { DialogTitle } from "@headlessui/react";

import Button from './../../internal/Button'
import PeopleMultiSelectWithAvatar from "../../internal/PeopleMultiSelectWithAvatar";
import TextArea from "../../internal/TextArea";
import { usePortalClients } from "../../../hooks/react-query/usePortalData";
import { useSelector } from "react-redux";
import { createMassMessage } from "../../../services/chat";

const MassMessageForm = ({ onClose }) => {
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [comment, setComment] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const { user, currentSelectedPortal } = useSelector(state => state.auth)
    const { data: clients, isLoading } = usePortalClients(currentSelectedPortal)


    const handleChange = (selected) => {
        setSelectedPeople(selected);
        console.log("Selected people:", selected);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleMassMessageSubmit = async (e) => {
        e.preventDefault();
        console.log(`this is the selected people: `, selectedPeople)

        try {
            setIsCreating(true);
            const participants = selectedPeople.map((person) => person.id);

            let newMessage = {
                content: comment,
                status: "sent",
                sender_id: user.id,
                sender: {
                    id: user.id,
                    name: user.name,
                    avatar_url: user?.avatar_url,
                },
            };

            await createMassMessage(newMessage, participants, currentSelectedPortal);
            setIsCreating(false);
            onClose()
        } catch (error) {
            console.log(`Error creating mass message: `, error)

        }




    }

    if (isLoading) return <div className="flex items-center justify-center py-2"> Loading...  </div>


    return (
        <div >
            <div>
                <div className="mb-6">
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 mb-2">
                        Mass Message
                    </DialogTitle>
                    <p className="text-sm text-gray-500">
                        Send a direct message to multiple clients. Recipients cannot see each others’ replies.
                    </p>
                </div>
                <div className="flex flex-col gap-4">
                    <TextArea
                        label="Add your comment"
                        id="comment"
                        name="comment"
                        rows={4}
                        value={comment}
                        onChange={handleCommentChange}
                    />
                    <div>
                        <PeopleMultiSelectWithAvatar
                            people={clients}
                            onChange={handleChange}
                            label="Select client(s)"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <Button size="lg" onClick={onClose} variant="secondary">
                    Cancel
                </Button>
                <Button onClick={
                    handleMassMessageSubmit
                } size="lg" type="submit" data-autofocus  >
                    {
                        isCreating ? 'Sending...' : 'Send'
                    }
                </Button>
            </div>
        </div>
    );
};

export default MassMessageForm;

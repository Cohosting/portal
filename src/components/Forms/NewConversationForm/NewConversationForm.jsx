import { useState } from "react";
import PeopleMultiSelectWithAvatar from "../../UI/PeopleMultiSelectWithAvatar";
import Button from './../../UI/Button';
import { useSelector } from "react-redux";
import { createConversation, } from "../../../services/chat";
import { usePortalClients } from "../../../hooks/react-query/usePortalData";



const NewConversationForm = ({ onClose }) => {
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    const { user } = useSelector(state => state.auth)
    const { data: clients, isLoading } = usePortalClients(user?.portals[0])

    const handleChange = (selected) => {
        setSelectedPeople(selected);
        console.log("Selected people:", selected);
    };
    if (isLoading) return <div className="flex items-center justify-center py-2"> Loading...  </div>

    const handleCreateConversation = async () => {
        try {
            setIsCreating(true);
            const newConversationData = {
                name: "New Group Chat",
                portal_id: user.portals[0],
            };
            const participantIds = selectedPeople.map((participant) => participant.id);

            const newConversationId = await createConversation(newConversationData, participantIds);
            console.log("New conversation created with ID:", newConversationId);
            setIsCreating(false);
            onClose()

        } catch (error) {
            console.log(`Error creating conversation_and_participants: `, error)

        }

    }

    return (
        <>
            <div>
                <div className="mb-6">
                    <h3
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900 mb-2"
                    >
                        New Conversation
                    </h3>
                    <p className="text-sm text-gray-500">
                        Create a conversation where all the recipients can see each other
                    </p>
                </div>
                <PeopleMultiSelectWithAvatar
                    people={clients}
                    onChange={handleChange}
                    label="Select client(s) or company"
                />
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <Button size="lg" onClick={onClose} variant="secondary">
                    Cancel
                </Button>
                <Button size="lg" data-autofocus onClick={handleCreateConversation}>
                    {
                        isCreating ? 'Creating...' : 'Create'
                    }
                </Button>
            </div>
        </>
    );
};

export default NewConversationForm;

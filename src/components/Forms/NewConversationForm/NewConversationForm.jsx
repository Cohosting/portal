import { useState } from "react";
import PeopleMultiSelectWithAvatar from "../../internal/PeopleMultiSelectWithAvatar";
import Button from './../../internal/Button';
import { useSelector } from "react-redux";
import { createConversation } from "../../../services/chat";
import { usePortalClients, usePortalData } from "../../../hooks/react-query/usePortalData";

const NewConversationForm = ({ onClose }) => {
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [conversationName, setConversationName] = useState("");

    const { user, currentSelectedPortal } = useSelector(state => state.auth);
    const { data: portal, isLoading: portalLoading } = usePortalData(currentSelectedPortal);
    const { data: clients, isLoading } = usePortalClients(currentSelectedPortal);

    const handleChange = (selected) => {
        setSelectedPeople(selected);
        console.log("Selected people:", selected);
    };

    if (isLoading || portalLoading) return <div className="flex items-center justify-center py-2"> Loading...  </div>;

    const handleCreateConversation = async () => {
        if (conversationName === "" && selectedPeople.length > 1) {
            alert("Please enter a conversation name");
            return;
        }
        try {
            setIsCreating(true);
            const newConversationData = {
                name: selectedPeople.length > 1 ? `${portal.brand_settings.brandName} - ${conversationName}` : portal.brand_settings.brandName,
                portal_id: currentSelectedPortal
            };
            const participantIds = selectedPeople.map((participant) => participant.id);

            const newConversationId = await createConversation(newConversationData, participantIds);
            console.log("New conversation created with ID:", newConversationId);
            setIsCreating(false);
            onClose();

        } catch (error) {
            console.log(`Error creating conversation_and_participants: `, error);
        }
    };


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
                {selectedPeople.length > 1 && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Conversation Name
                        </label>
                        <input
                            type="text"
                            value={conversationName}
                            onChange={(e) => setConversationName(e.target.value)}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                )}
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

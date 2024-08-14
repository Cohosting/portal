import React from 'react'
import { useClientAuth } from '../../../hooks/useClientAuth';
import { useClientConversations } from '../../../hooks/useClientConversations';
import ClientChatLayout from './Layout/ClientChatLayout';

const Chat = ({ portalData }) => {
    const { clientUser } = useClientAuth(portalData.id);
    const { conversations, fetchedWay, optimisticMarkLastMessageAsSeen, isLoading } = useClientConversations(portalData.id, clientUser?.id);

    if (isLoading) {
        return <div>Loading...</div>
    }
    return (

        <ClientChatLayout optimisticMarkLastMessageAsSeen={optimisticMarkLastMessageAsSeen} user={clientUser} conversations={conversations}>
            s
        </ClientChatLayout>


    )
}

export default Chat
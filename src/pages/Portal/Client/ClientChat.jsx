import React from 'react'
import { useClientAuth } from '../../../hooks/useClientAuth';
import { useClientConversations } from '../../../hooks/useClientConversations';
import ClientChatLayout from './Layout/ClientChatLayout';

const Chat = ({ portalData }) => {
    const { clientUser } = useClientAuth(portalData.id);
    const { conversations, fetchedWay, optimisticMarkLastMessageAsSeen, isLoading } = useClientConversations(portalData.id, clientUser?.id);

    if (isLoading) {
        return  (
            <div className="flex justify-between items-center w-full p-4 border-b border-gray-200">
            {/* Title skeleton */}
            <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            
            {/* Menu button skeleton */}
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

        )
    }
 
    return (

        <ClientChatLayout portal={portalData} optimisticMarkLastMessageAsSeen={optimisticMarkLastMessageAsSeen} user={clientUser} conversations={conversations}>
           
        </ClientChatLayout>


    )
}

export default Chat
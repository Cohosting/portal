import React from 'react'
import Conversation from '../components/Conversation'
import ConversationList from '../../../../components/Chat/Sidebar/ConversationList'
import { useMediaQuery } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ClientChatLayout = ({
    conversations,
    user,
    optimisticMarkLastMessageAsSeen
}) => {

    const navigate = useNavigate();
    // parsing query string
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const conversationId = urlParams.get('conversation-id');

    const [isLessThan768] = useMediaQuery('(max-width: 768px)');
    console.log(user.id)


    if (conversations.length === 0) {
        return (
            <div>
                <h1>No Conversations</h1>
            </div>
        )
    }

    if (conversations.length === 1) {
        if (!conversationId) {

            navigate(`/portal/messages?conversation-id=${conversations[0].id}`)
        }

        return <div className="flex h-screen">
            <div className={`flex-grow `}>

                <Conversation user={user} conversationId={conversationId} isClientExperience={true} conversations={conversations} />
            </div>
        </div>
    }


    return (
        // more then one conversation so we will render list of covneration and conversation side by side
        <div className="flex h-screen">
            <div className={` chat-layout fixed lg:inset-y-0 lg:z-50 h-screen ${isLessThan768 ? 'w-full' : 'w-72'}  flex lg:flex-col`}>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-0     ">
                    <div>
                        <p className='px-4 pt-5 text-sm'> Conversations</p>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ConversationList optimisticMarkLastMessageAsSeen={optimisticMarkLastMessageAsSeen} convId={conversationId} isClientExperience={true} userId={user?.id} conversations={conversations} />

                    </nav>


                </div>


            </div>


            <div className={`flex-grow   ${isLessThan768 ? 'ml-0' : 'ml-72'} `}>
                {
                    conversationId ? <Conversation conversations={conversations} conversationId={conversationId} user={user} /> : <div className="flex items-center justify-center py-2"> Select a conversation to start chatting </div>
                }


            </div>

        </div>

    )
}

export default ClientChatLayout
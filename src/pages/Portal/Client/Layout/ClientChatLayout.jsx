import React, { useEffect } from 'react'
import Conversation from '../components/Conversation'
import ConversationList from '../../../../components/Chat/Sidebar/ConversationList'
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { Chat } from '@phosphor-icons/react';

const NoConverstionNotification = () => {
    return (
        <div className="w-full mt-[150px] max-w-md mx-auto bg-gradient-to-b from-background to-muted/50 border border-muted-foreground/20 rounded-lg shadow-sm">
            <div className="pt-6 pb-4 px-4 flex flex-col items-center text-center">
                <Chat className="h-12 w-12 mb-4 text-muted-foreground/70" />
                <h3 className="text-lg font-medium mb-2 text-foreground">No conversations yet</h3>
                <p className="text-sm text-muted-foreground">
                    Your chat history will appear here once you start or join a conversation.
                </p>
            </div>
        </div>
    )
}

const ClientChatLayout = ({
    conversations,
    user,
    optimisticMarkLastMessageAsSeen,
    portal
}) => {

    const navigate = useNavigate();
    // parsing query string
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const conversationId = urlParams.get('conversation-id');

    const isLessThan768 = useMediaQuery({ query: '(max-width: 768px)' });
    console.log(user.id)
    console.log({ conversations })

    useEffect(() => {
        let doesConversationNotExist = !conversations.find(conv => conv.id === conversationId)

        if (conversationId && doesConversationNotExist) {
            navigate('/portal/messages')
        }

    }, [conversations])


    if (conversations.length === 0) return <NoConverstionNotification />

    if (conversations.length === 1) {
        if (!conversationId) {

            window.location.href = `/portal/messages?conversation-id=${conversations[0].id}`;
            return
        }

        return <div className="flex h-screen">
            <div className={`flex-grow `}>
                <Conversation hasManyConversation={false} user={user} conversationId={conversationId} isClientExperience={true} conversations={conversations} />
            </div>
        </div>
    };



    return (

        <div className="flex h-screen">
            <div className={` chat-layout fixed lg:inset-y-0 lg:z-50 h-screen ${isLessThan768 ? 'w-full' : 'w-72'}  flex lg:flex-col`}>
                {(!isLessThan768 || !conversationId) && (
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-0">
                        <div>
                            <p className='px-4 pt-5 text-sm'>Conversations</p>
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ConversationList
                                portal={portal}
                                optimisticMarkLastMessageAsSeen={optimisticMarkLastMessageAsSeen}
                                convId={conversationId}
                                isClientExperience={true}
                                userId={user?.id}
                                conversations={conversations}
                            />
                        </nav>
                    </div>
                )}

            </div>
            {
                conversationId && (
                    <div className={`flex-grow   ${isLessThan768 ? 'ml-0' : 'ml-72'} `}>
                {
                            conversationId ? <Conversation hasManyConversation={true} conversations={conversations} isClientExperience={true} conversationId={conversationId} user={user} /> : <div className="flex items-center justify-center py-2"> Select a conversation to start chatting </div>
                        }
                    </div>
                )
            }


        </div>
    )
}

export default ClientChatLayout
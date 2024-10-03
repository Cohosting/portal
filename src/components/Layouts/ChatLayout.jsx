import React, { useCallback, useEffect, useState } from 'react'

import ConversionHeader from '../Chat/Sidebar/ConversationHeader';
import ConversationList from '../Chat/Sidebar/ConversationList';
import { BaseModal } from '../Modal';
import MassMessageForm from '../Forms/MassMessageForm';
import NewConversationForm from '../Forms/NewConversationForm';

import { useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { useChatConversations } from '../../hooks/react-query/useChat';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Spinner } from '@phosphor-icons/react';

const ChatLayout = ({ setIsConversationsListLoading, isLoading, conversations, optimisticMarkLastMessageAsSeen }) => {
    const { user, currentSelectedPortal } = useSelector(state => state.auth)
    const { isOpen: isNewConversationOpen, onOpen: onNewConversationOpen, onClose: onNewConversationClose } = useDisclosure()
    const { isOpen: isMassConversationOpen, onOpen: onMassConversationOpen, onClose: onMassConversationClose } = useDisclosure()
    const { conversationId } = useParams();

    const [isLessThan768] = useMediaQuery('(max-width: 768px)');

    const handleNewConversation = () => onNewConversationOpen();
    const handleMassConversation = () => onMassConversationOpen();



    useEffect(() => {
        setIsConversationsListLoading(isLoading)
    }, [isLoading, setIsConversationsListLoading,])


    return (
        <div className={` chat-layout fixed lg:inset-y-0 lg:z-50 h-screen ${isLessThan768 ? 'w-full' : 'w-72'}  flex lg:flex-col`}>
            {(!isLessThan768 || !conversationId) && (
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-0">
                    <nav className="flex flex-1 flex-col">
                        <ConversionHeader
                            handleNewConversation={handleNewConversation}
                            handleMassConversation={handleMassConversation}
                        />
                        {isLoading ? (
                            <div className="flex justify-center mt-5 items-center">
                                <Spinner className='animate-spin ' size={32} ></Spinner>
                            </div>
                        ) : conversations.length > 0 ? (
                            <ul className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ConversationList optimisticMarkLastMessageAsSeen={optimisticMarkLastMessageAsSeen} userId={user.id} conversations={conversations} />
                                </li>
                            </ul>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <p className="text-gray-500 text-center">No conversations yet.<br />Start a new conversation!</p>
                            </div>
                        )}
                    </nav>
                </div>
            )}

            {/* Modal for creating new conversations */}
            <BaseModal isOpen={isNewConversationOpen} onClose={onNewConversationClose}>
                <NewConversationForm onClose={onNewConversationClose} />
            </BaseModal>
            <BaseModal isOpen={isMassConversationOpen} onClose={onMassConversationClose}>
                <MassMessageForm onClose={onMassConversationClose} />
            </BaseModal>
        </div>
    )
}

export default ChatLayout
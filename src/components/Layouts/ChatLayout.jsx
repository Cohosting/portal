

import React, { useEffect } from 'react'

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
const ChatLayout = ({ setIsConversationsListLoading }) => {
    const { user } = useSelector(state => state.auth)
    const { isOpen: isNewConversationOpen, onOpen: onNewConversationOpen, onClose: onNewConversationClose } = useDisclosure()
    const { isOpen: isMassConversationOpen, onOpen: onMassConversationOpen, onClose: onMassConversationClose } = useDisclosure()
    const { conversationId } = useParams();

    const [isLessThan768] = useMediaQuery('(max-width: 768px)');

    const handleNewConversation = () => onNewConversationOpen();
    const handleMassConversation = () => onMassConversationOpen();

    const { data: conversations, isLoading } = useChatConversations(user?.portals[0])



    useEffect(() => {

        setIsConversationsListLoading(isLoading)


    }, [isLoading, setIsConversationsListLoading])
    // if (isLoading) return <div className="flex items-center justify-center py-2"> Loading...  </div>




    return (
        <div className={` chat-layout fixed lg:inset-y-0 lg:z-50 h-screen ${isLessThan768 ? 'w-full' : 'w-72'}  flex lg:flex-col`}>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            {(!isLessThan768 || !conversationId) && (
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-0     ">
                    <nav className="flex flex-1 flex-col">
                        <ConversionHeader
                            handleNewConversation={handleNewConversation}
                            handleMassConversation={handleMassConversation}
                        />
                        {
                            isLoading ? (
                                // svg loading animation tailwind css
                                <div className="flex justify-center mt-5 items-center">
                                    <Spinner className='animate-spin ' size={32} ></Spinner>
                                </div>

                            ) : (
                                <ul className="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <ConversationList conversations={conversations} />
                                    </li>
                                </ul>
                            )
                        }

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
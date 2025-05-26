import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useToggle } from 'react-use';
import { Spinner } from '@phosphor-icons/react';

import ConversionHeader from '../Chat/Sidebar/ConversationHeader';
import ConversationList from '../Chat/Sidebar/ConversationList';
import { BaseModal } from '../Modal';
import MassMessageForm from '../Forms/MassMessageForm';
import NewConversationForm from '../Forms/NewConversationForm';
import { useChatConversations } from '../../hooks/react-query/useChat';
import { usePortalData } from '../../hooks/react-query/usePortalData';

const ChatLayout = ({ setIsConversationsListLoading, isLoading, conversations, optimisticMarkLastMessageAsSeen }) => {
    const { user, currentSelectedPortal } = useSelector(state => state.auth);
    const { conversationId } = useParams();
    const navigate = useNavigate();
    
    const [isNewConversationOpen, toggleNewConversationOpen] = useToggle(false);
    const [isMassConversationOpen, toggleMassConversationOpen] = useToggle(false);
    const { data: portal } = usePortalData(currentSelectedPortal);

    const isLessThan768 = useMediaQuery({ query: '(max-width: 768px)' });

    const handleNewConversation = () => toggleNewConversationOpen();
    const handleMassConversation = () => toggleMassConversationOpen();

    // Auto-redirect to first conversation if no conversationId is present
    useEffect(() => {
        if (!conversationId && conversations && conversations.length > 0 && !isLessThan768 && !isLoading) {
            const firstConversationId = conversations[0].id;
            const basePath = window.location.pathname.includes('portal') ? '/portal/messages' : '/messages';
            navigate(`${basePath}/${firstConversationId}`, { replace: true });
        }
    }, [conversationId, conversations, isLoading, navigate]);

    useEffect(() => {
        setIsConversationsListLoading(isLoading);
    }, [isLoading, setIsConversationsListLoading]);

    return (
        <div className={`chat-layout fixed lg:inset-y-0 lg:z-50 h-screen ${isLessThan768 ? 'w-full' : 'w-72'} flex lg:flex-col`}>
            {(!isLessThan768 || !conversationId) && (
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-0">
                    <nav className="flex flex-1 flex-col">
                        <ConversionHeader
                            handleNewConversation={handleNewConversation}
                            handleMassConversation={handleMassConversation}
                        />
                        {isLoading ? (
                            <div className="flex justify-center mt-5 items-center">
                                <Spinner className='animate-spin' size={32} />
                            </div>
                        ) : conversations.length > 0 ? (
                            <ul className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ConversationList 
                                        portal={portal} 
                                        optimisticMarkLastMessageAsSeen={optimisticMarkLastMessageAsSeen} 
                                        userId={user.id} 
                                        conversations={conversations} 
                                    />
                                </li>
                            </ul>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <p className="text-gray-500 text-center">
                                    No conversations yet.<br />Start a new conversation!
                                </p>
                            </div>
                        )}
                    </nav>
                </div>
            )}

            {/* Modal for creating new conversations */}
            <BaseModal isOpen={isNewConversationOpen} onClose={toggleNewConversationOpen}>
                <NewConversationForm onClose={toggleNewConversationOpen} />
            </BaseModal>
            <BaseModal isOpen={isMassConversationOpen} onClose={toggleMassConversationOpen}>
                <MassMessageForm onClose={toggleMassConversationOpen} />
            </BaseModal>
        </div>
    )
}

export default ChatLayout
// components/Conversation.js
import React, { useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ConversationHeader from '../../components/Chat/ConversationWindow/ConversationHeader';
import MessageInput from '../../components/Chat/ConversationWindow/MessageInput';
import MessageList from '../../components/Chat/ConversationWindow/MessageList';
import { Spinner } from '@phosphor-icons/react';
import { useConversation } from '../../hooks/useConversation';
import { useSelector } from 'react-redux';
import { useConversationContext } from '../../context/useConversationContext';
import { markAsSeen } from '../../services/chat';
import { useLastElementObserver } from '../../hooks/useLastElementObserver';
import FloatingNewMessageAlert from '../../components/UI/FloatingNewMessageAlert';
import { useHandleNewMessage } from '../../hooks/conversations/useHandleNewMessage';
import { useMarkConversationAsSeen } from '../../hooks/conversations/useMarkConversationAsSeen';
import { useScrollToEndOnMessageChange } from '../../hooks/conversations/useScrollToEndOnMessageChange';

const Conversation = () => {
    const { conversationId } = useParams();
    const lastElementVisible = useRef(null);
    const containerRef = useRef(null);
    const [isFloatingAlertVisible, setIsFloatingAlertVisible] = useState(false);

    const { isConversationsListLoading, conversations, refetchConversations } = useOutletContext();
    const { user } = useSelector(state => state.auth);
    const {
        isLoading,
        messages,
        hasMore,
        moreLoading,
        isFileUploading,
        setIsFileUploading,
        messagesEndRef,
        handleFetchMore,
        handleSendMessage,
        handleDeleteConversation,
        fetchedWay
    } = useConversation(conversationId, user, conversations);
    const { listRef } = useConversationContext();
    useScrollToEndOnMessageChange(messages, messagesEndRef, lastElementVisible);
    useMarkConversationAsSeen(messages, conversations, conversationId, user.id);
    useHandleNewMessage(messages, conversationId, conversations, fetchedWay, lastElementVisible, setIsFloatingAlertVisible, user.id);


    // Callback function to handle visibility
    const handleVisibilityChange = (isVisible) => {
        if (isVisible) {
            console.log('The last item is in view!');
            lastElementVisible.current = true;
            if (isFloatingAlertVisible) {
                setIsFloatingAlertVisible(false);
                if (conversations.length > 0 && user.id) {
                    markAsSeen(conversations.find(conv => conv.id === conversationId), user.id)
                } else {
                    throw new Error('Conversations array is empty or user id is not available')
                }
            }
        } else {
            console.log('The last item is not in view.');
            lastElementVisible.current = false;
        }
    };



    // Get the observeLastElement function from the custom hook
    const observeLastElement = useLastElementObserver(handleVisibilityChange, {
        root: listRef.current,
        threshold: 1
    });

    if (isConversationsListLoading) {
        return (
            <div className="flex justify-center mt-5 items-center">
                <Spinner className='animate-spin' size={32} />
            </div>
        );
    }

    const conversation = conversations.find(conv => conv.id === conversationId)
    return (
        <div ref={containerRef} className="p-6 px-0 pt-0 pb-0 min-h-screen flex flex-col">
            {isLoading ? (
                <div className="  mt-10 w-full h-full bg-white bg-opacity-50 z-50 flex items-center justify-center">
                    <Spinner className='animate-spin' size={32} />
                </div>
            ) : (
                    <>
                    {!messages && <div className="text-center mt-4">No messages</div>}

                        <div className="sticky px-6 shadow-sm top-0 bg-white z-10 py-3">
                            <ConversationHeader
                                name={conversation?.name}
                                handleDeleteConversation={handleDeleteConversation}
                                refetchConversations={refetchConversations}
                            />
                        </div>

                        <div className="flex-grow overflow-y-auto"   >
                            {hasMore && (
                                <div className="text-center flex items-center justify-center py-4  ">
                                    <button
                                        onClick={() => handleFetchMore(listRef)}
                                        className="bg-gray-100 flex gap-x-2 items-center px-4 py-2 rounded-lg text-sm font-semibold text-gray-500"
                                    >
                                        {moreLoading && (
                                            <Spinner className='animate-spin' size={16} />
                                        )}
                                        Load more
                                    </button>
                                </div>
                            )}

                            <MessageList observeLastElement={observeLastElement} messages={messages} user={user} />
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="sticky bottom-0 w-full bg-transparent z-[100]">
                            <FloatingNewMessageAlert
                                onClick={() => {
                                    setIsFloatingAlertVisible(false)
                                    if (conversations.length > 0 && user.id) {
                                        markAsSeen(conversations.find(conv => conv.id === conversationId), user.id)

                                    } else {
                                        throw new Error('Conversations array is empty or user id is not available')
                                    }
                                }}
                                showButton={isFloatingAlertVisible} containerRef={containerRef} messagesEndRef={messagesEndRef} />

                            <div className='h-full  px-6 bg-white'>
                                <MessageInput
                                    isFileUploading={isFileUploading}
                                    setIsFileUploading={setIsFileUploading}
                                    onSendMessage={handleSendMessage}
                                />
                            </div>


                    </div>
                    </>

            )

            }


        </div>
    );
};

export default Conversation;
import React, { useEffect, useRef, useState } from 'react'
import ConversationHeader from '../../../../components/Chat/ConversationWindow/ConversationHeader'
import MessageList from '../../../../components/Chat/ConversationWindow/MessageList'
import MessageInput from '../../../../components/Chat/ConversationWindow/MessageInput'
import { useConversation } from '../../../../hooks/useConversation'
import { useConversationContext } from '../../../../context/useConversationContext'
import { useLastElementObserver } from '../../../../hooks/useLastElementObserver'
import { useScrollToEndOnMessageChange } from '../../../../hooks/conversations/useScrollToEndOnMessageChange'
import { useMarkConversationAsSeen } from '../../../../hooks/conversations/useMarkConversationAsSeen'
import { useHandleNewMessage } from '../../../../hooks/conversations/useHandleNewMessage'
import FloatingNewMessageAlert from '../../../../components/internal/FloatingNewMessageAlert'
import { markAsSeen } from '../../../../services/chat'
import { Loader2 } from 'lucide-react'

const Conversation = ({ conversationId, user, conversations, isClientExperience, length, colorSettings }) => {
    const [isFloatingAlertVisible, setIsFloatingAlertVisible] = useState(false);
    const lastElementVisible = useRef(null);
    const onMount = useRef(true);
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
    const handleVisibilityChange = (isVisible) => {
        if (isVisible) {
            console.log('The last item is in view!');
            lastElementVisible.current = true;
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
    useEffect(() => {
        if (!messages.length) return;

        if (messagesEndRef.current) {

            if (lastElementVisible.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "instant" });
            } else if (onMount.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "instant" });
                onMount.current = false;
            }
        }
    }, [messages, messagesEndRef, lastElementVisible, onMount]);

    if (isLoading) {
        return (
            <div className="flex justify-between items-center w-full p-4 border-b border-gray-200">
            {/* Title skeleton */}
            <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            
            {/* Menu button skeleton */}
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        )
    }
    const conversation = conversations.find(conv => conv.id === conversationId)



    return (
        <div className="p-6 px-0 pt-0 pb-0 min-h-screen  flex flex-col">
            <div className="sticky px-6 shadow-sm top-0 bg-white z-10 py-3">

                <ConversationHeader
                length={length}
                    name={conversation?.name}
                    handleDeleteConversation={handleDeleteConversation}
                />
            </div>
            <div className="flex-grow overflow-y-auto px-4  "   >
                {
                    hasMore && (
                        <div className="text-center flex items-center justify-center py-4  ">
                            <button
                                onClick={() => handleFetchMore(listRef)}
                                className="bg-gray-100 flex gap-x-2 items-center px-4 py-2 rounded-lg text-sm font-semibold text-gray-500"
                            >
                                {moreLoading && (
                                    <Loader2 className='animate-spin' size={16} />
                                )}
                                Load more
                            </button>
                        </div>
                    )
                }
                <div>

                    <MessageList colorSettings={colorSettings} observeLastElement={observeLastElement} messages={messages} user={user} />
                    <div ref={messagesEndRef} />
                </div>

            </div>


            <div className="sticky px-6 bottom-0 w-full bg-white ">
                {
                    isFloatingAlertVisible && (
                        <FloatingNewMessageAlert
                            showButton={isFloatingAlertVisible}
                            messagesEndRef={messagesEndRef}
                            onClick={() => {
                                setIsFloatingAlertVisible(false)
                                if (conversations.length > 0 && user.id) {
                                    markAsSeen(conversations.find(conv => conv.id === conversationId), user.id)

                                } else {
                                    throw new Error('Conversations array is empty or user id is not available')
                                }
                            }}
                        />
                    )
                }
                <MessageInput
                    isFileUploading={isFileUploading}
                    setIsFileUploading={setIsFileUploading}
                    onSendMessage={handleSendMessage}
                    colorSettings={colorSettings}
                />
            </div>
        </div>
    )
}

export default Conversation
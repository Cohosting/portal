import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
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
import AlertDialog from '@/components/Modal/AlertDialog'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Conversation = ({ conversationId, user, conversations, isClientExperience, length, colorSettings }) => {
    const [isFloatingAlertVisible, setIsFloatingAlertVisible] = useState(false);
    const lastElementVisible = useRef(null);
    const onMount = useRef(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const navigate = useNavigate();
    const { listRef } = useConversationContext();

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
    } = useConversation(conversationId, user, conversations, listRef);
    
    
    // Stable callback reference
    const handleVisibilityChange = useCallback((isVisible) => {
        console.log('Visibility changed:', isVisible);
        if (isVisible) {
            console.log('The last item is in view!');
            lastElementVisible.current = true;
        } else {
            console.log('The last item is not in view.');
            lastElementVisible.current = false;
        }
    }, []); // Empty dependency array - this callback never changes

    // Stable observer options
    const observerOptions = useMemo(() => ({
        root: null,
        threshold: 1
    }), []); // Empty dependency array - options never change

    // Get both the observer function and visibility state
    const { observeLastElement, isVisible } = useLastElementObserver(handleVisibilityChange, observerOptions);
    
    // You can now use isVisible boolean directly
    console.log('Current visibility state:', isVisible);
    
    useScrollToEndOnMessageChange(messages, messagesEndRef, lastElementVisible);
    useMarkConversationAsSeen(messages, conversations, conversationId, user.id);
    useHandleNewMessage(messages, conversationId, conversations, fetchedWay, lastElementVisible, setIsFloatingAlertVisible, user.id);

    useEffect(() => {
        if (!messages.length) return;
        console.log('Scroll to end', messages.length, lastElementVisible.current, messagesEndRef.current);

        if(isVisible) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });

        }  
        if (messagesEndRef.current) {
            if (lastElementVisible.current || isVisible) { // Can use either ref or state
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            } else if (onMount.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
                onMount.current = false;
            }
        }
    }, [messages, messagesEndRef, lastElementVisible,  onMount]);

    if (isLoading) {
        return (
            <div className="flex justify-between items-center w-full p-4 border-b border-gray-200">
                <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
        )
    }
    
    const conversation = conversations.find(conv => conv.id === conversationId)

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await handleDeleteConversation();
            navigate('/portal/messages');
        } catch (error) {
            console.error('Error deleting conversation:', error);
            toast.error('Failed to delete conversation');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="p-6 px-0 pt-0 pb-0 min-h-screen flex flex-col">
            <div className="sticky px-6 shadow-sm top-0 bg-white z-10 max-lg:py-3 py-2">
                <ConversationHeader
                    length={length}
                    name={conversation?.name}
                    handleDeleteConversation={() => setIsOpen(true)}
                    participants={conversation?.participants}
                    currentUserId={user.id}
                />
            </div>
            <div className="flex-grow overflow-y-auto px-4">
                {hasMore && (
                    <div className="text-center flex items-center justify-center py-4">
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
                )}
                <div>
                    <MessageList 
                    colorSettings={colorSettings} 
                    observeLastElement={observeLastElement}
                     messages={messages} user={user} 
                     />
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="sticky px-6 sm:px-4 bottom-0 w-full bg-white">
                {/* Show floating alert when not visible */}
                {isFloatingAlertVisible && !isVisible && (
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
                )}
                <MessageInput
                    isFileUploading={isFileUploading}
                    setIsFileUploading={setIsFileUploading}
                    onSendMessage={handleSendMessage}
                    colorSettings={colorSettings}
                />
            </div>
            <AlertDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Conversation"
                message="Are you sure you want to delete this conversation?"
                confirmButtonText={isDeleting ? 'Deleting...' : 'Delete'}
                confirmButtonColor="bg-red-500"
            />
        </div>
    )
}

export default Conversation
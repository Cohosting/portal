// components/Conversation.js
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import ConversationHeader from '../../components/Chat/ConversationWindow/ConversationHeader';
import MessageInput from '../../components/Chat/ConversationWindow/MessageInput';
import MessageList from '../../components/Chat/ConversationWindow/MessageList';
import { Loader2, XCircle } from 'lucide-react';
import { useConversation } from '../../hooks/useConversation';
import { useSelector } from 'react-redux';
import { useConversationContext } from '../../context/useConversationContext';
import { markAsSeen } from '../../services/chat';
import { useLastElementObserver } from '../../hooks/useLastElementObserver';
import FloatingNewMessageAlert from '../../components/internal/FloatingNewMessageAlert';
import { useHandleNewMessage } from '../../hooks/conversations/useHandleNewMessage';
import { useMarkConversationAsSeen } from '../../hooks/conversations/useMarkConversationAsSeen';
import { useScrollToEndOnMessageChange } from '../../hooks/conversations/useScrollToEndOnMessageChange';
import { supabase } from '../../lib/supabase';
import AlertDialog from '@/components/Modal/AlertDialog';
import { toast } from 'react-toastify';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NoConversation = () => {
    const navigation = useNavigate();

    const handleGoBack = () => {
        if (window.location.pathname.includes('portal')) {
            navigation('/portal/messages');
        } else {
            navigation('/messages');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full  mt-24 p-8">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full">
                    <MessageCircle className="w-10 h-10 text-gray-400" />
                </div>
                
                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    No Conversation Selected
                </h2>
                
                {/* Description */}
                <p className="text-gray-500 mb-8 leading-relaxed">
                    The conversation you're looking for might have been deleted or doesn't exist. 
                    Please select a conversation from the sidebar or start a new one.
                </p>
                
                {/* Action Button */}
                <Button
                    onClick={handleGoBack}
                    variant="outline"
                    
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Messages
                </Button>
            </div>
        </div>
    );
};
const Conversation = () => {
    const { conversationId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const lastElementVisible = useRef(null);
    const containerRef = useRef(null);
    const [isFloatingAlertVisible, setIsFloatingAlertVisible] = useState(false);
    const { isConversationsListLoading, conversations, refetchConversations } = useOutletContext();
    const [isConversationsDeleted, setIsConversationsDeleted] = useState(false);
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
        fetchedWay,
        error,
    } = useConversation(conversationId, user, conversations);

    const { listRef } = useConversationContext();
    useScrollToEndOnMessageChange(messages, messagesEndRef, lastElementVisible);
    useMarkConversationAsSeen(messages, conversations, conversationId, user.id);
    useHandleNewMessage(messages, conversationId, conversations, fetchedWay, lastElementVisible, setIsFloatingAlertVisible, user.id);

    const handleVisibilityChange = (isVisible) => {
        if (isVisible) {
            lastElementVisible.current = true;
            if (isFloatingAlertVisible) {
                setIsFloatingAlertVisible(false);
                if (conversations.length > 0 && user.id) {
            markAsSeen(conversations.find(conv => conv.id === conversationId), user.id);
        } else {
                throw new Error('Conversations array is empty or user id is not available');
            }
        }
    } else {
          lastElementVisible.current = false;
      }
  };

    const observeLastElement = useLastElementObserver(handleVisibilityChange, {
        root: listRef.current,
        threshold: 1
    });

    if (isConversationsListLoading) {
        return (
            <div className="flex justify-center mt-5 items-center">
              <Loader2 className="animate-spin" size={32} />
          </div>
      );
  }

    const conversation = conversations.find(conv => conv.id === conversationId);

    if (isLoading) {
        return (
        <div className="mt-10 w-full h-full bg-white bg-opacity-50 z-50 flex items-center justify-center">
            <Loader2 className="animate-spin" size={32} />
        </div>
      );
  }

    if (!conversation) {
      return <NoConversation />;
  }


            const handleConfirmDelete = async () => {

                try {
                    setIsDeleting(true);
                    await handleDeleteConversation();
                    refetchConversations && await refetchConversations();
                    if (window.location.pathname.includes('portal')) {
                        navigate('/portal/messages');
                    } else {
                        navigate('/messages');
                    }
                } catch (error) {
                    console.error('Error deleting conversation:', error);
                    toast.error('Failed to delete conversation');
                } finally {
                    setIsDeleting(false);
                }
          
            }
    return (
        <div ref={containerRef} className="p-6 px-4 pl-0 pt-0 pb-0 min-h-screen flex flex-col">
          {!messages && <div className="text-center mt-4">No messages</div>}

          <div className="sticky px-6 shadow-sm top-0 bg-white z-10 py-3">
              <ConversationHeader
              conversationId={conversationId}
                  name={
                      conversation?.participants === 1
                          ? conversation?.participants.map(participant => participant.name).join(', ')
                          : conversation?.name
                  }
                  handleDeleteConversation={() => setIsOpen(true)}
                  refetchConversations={refetchConversations}
                  participants={conversation.participants}
              />
          </div>

          <div className="flex-grow overflow-y-auto px-3">
              {hasMore && (
                  <div className="text-center flex items-center justify-center py-4">
                      <button
                          onClick={() => handleFetchMore(listRef)}
                          className="bg-gray-100 flex gap-x-2 items-center px-4 py-2 rounded-lg text-sm font-semibold text-gray-500"
                      >
                          {moreLoading && <Loader2 className="animate-spin" size={16} />}
                          Load more
                      </button>
                  </div>
              )}

              <MessageList observeLastElement={observeLastElement} messages={messages} user={user} />
              <div ref={messagesEndRef} />
          </div>

          <div className="sticky bottom-0 w-full bg-transparent ">
              <FloatingNewMessageAlert
                  onClick={() => {
                      setIsFloatingAlertVisible(false);
                      if (conversations.length > 0 && user.id) {
                markAsSeen(conversations.find(conv => conv.id === conversationId), user.id);
            } else {
                          throw new Error('Conversations array is empty or user id is not available');
                      }
                  }}
                  showButton={isFloatingAlertVisible}
                  containerRef={containerRef}
                  messagesEndRef={messagesEndRef}
              />

              <div className="h-full px-3 bg-white">
                  <MessageInput
                      isFileUploading={isFileUploading}
                      setIsFileUploading={setIsFileUploading}
                      onSendMessage={handleSendMessage}
                  />
              </div>
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
  );
};

export default Conversation;

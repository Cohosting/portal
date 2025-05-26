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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md">
                <div className="p-8 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full">
                      <XCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                      Conversation Not Found
                  </h2>
                  <p className="text-gray-600">
                      The conversation you are looking for might have been deleted or does not exist.
                  </p>
              </div>
              <div className="px-8 py-4 bg-gray-50 rounded-b-lg">
                  <Link href="/conversations">
                      <button
                          onClick={handleGoBack}
                          className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                          Go Back to Conversations
                      </button>
                  </Link>
              </div>
          </div>
      </div>
    );
};

const Conversation = () => {
    const { conversationId } = useParams();
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

    return (
        <div ref={containerRef} className="p-6 px-4 pl-0 pt-0 pb-0 min-h-screen flex flex-col">
          {!messages && <div className="text-center mt-4">No messages</div>}

          <div className="sticky px-6 shadow-sm top-0 bg-white z-10 py-3">
              <ConversationHeader
                  name={
                      conversation?.participants === 1
                          ? conversation?.participants.map(participant => participant.name).join(', ')
                          : conversation?.name
                  }
                  handleDeleteConversation={handleDeleteConversation}
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

          <div className="sticky bottom-0 w-full bg-transparent z-[100]">
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
      </div>
  );
};

export default Conversation;

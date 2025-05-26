import React, { useEffect } from 'react';
import Conversation from '../components/Conversation';
import ConversationList from '../../../../components/Chat/Sidebar/ConversationList';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import PageHeader from '@/components/internal/PageHeader';
import EmptyStateFeedback from '@/components/EmptyStateFeedback';
import { BiNetworkChart } from 'react-icons/bi';

const ClientChatLayout = ({
  conversations,
  user,
  optimisticMarkLastMessageAsSeen,
  portal,
}) => {
  const navigate = useNavigate();
  const isLessThan768 = useMediaQuery({ query: '(max-width: 768px)' });

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const conversationId = urlParams.get('conversation-id');

  // Redirect if URL has an invalid conversation ID
  useEffect(() => {
    const conversationExists = conversations.find((conv) => conv.id === conversationId);
    if (conversationId && !conversationExists) {
      navigate('/portal/messages', { replace: true });
    }
  }, [conversations, conversationId, navigate]);

  // Redirect to the only available conversation if there's only one and no ID yet
  useEffect(() => {
    if (conversations.length  && !conversationId && !isLessThan768) {
      navigate(`/portal/messages?conversation-id=${conversations[0].id}`, { replace: true });
    }
  }, [conversations, conversationId, navigate]);

  // Case: No conversations
  if (conversations.length === 0) {
    return (
      <>
        <PageHeader
          title="Messages"
          description="Your chat history will appear here once portal owner start or join a conversation."
          showSidebar={false}
        />
        <div className="mt-16">
          <EmptyStateFeedback
            IconComponent={BiNetworkChart}
            title="No conversations yet"
            message="Your chat history will appear here once the portal owner start or join a conversation."
            centered
          />
        </div>
      </>
    );
  }

  // Case: Exactly one conversation and already redirected to it
  if (conversations.length === 1 && conversationId) {
    return (
      <div className="flex h-screen">
        <div className="flex-grow">
          <Conversation
            hasManyConversation={false}
            user={user}
            conversationId={conversationId}
            isClientExperience={true}
            conversations={conversations}
            colorSettings={portal?.brand_settings}
          />
        </div>
      </div>
    );
  }

  // Case: Multiple conversations
  return (
    <div className="flex h-screen">
      <div
        className={`chat-layout fixed lg:inset-y-0 lg:z-50 h-screen ${
          isLessThan768 ? 'w-full' : 'w-72'
        } flex lg:flex-col`}
      >
        {(!isLessThan768 || !conversationId) && (
          <div className="flex grow flex-col   overflow-y-auto border-r border-gray-200 bg-white px-0">
            <div className='border-b pb-5'>
              <p className="px-4 pt-5 text-sm">Conversations</p>
            </div>
            <nav className="flex flex-1 flex-col">
              <ConversationList
                portal={portal}
                optimisticMarkLastMessageAsSeen={optimisticMarkLastMessageAsSeen}
                convId={conversationId}
                isClientExperience={true}
                userId={user?.id}
                conversations={conversations}
                colorSettings={portal?.brand_settings}
              />
            </nav>
          </div>
        )}
      </div>

      {conversationId && (
        <div className={`flex-grow ${isLessThan768 ? 'ml-0' : 'ml-72'}`}>
          <Conversation
            hasManyConversation={true}
            conversations={conversations}
            isClientExperience={true}
            conversationId={conversationId}
            user={user}
            colorSettings={portal?.brand_settings}

          />
        </div>
      )}
    </div>
  );
};

export default ClientChatLayout;
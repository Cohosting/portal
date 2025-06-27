import React, { useEffect, useCallback, useMemo } from 'react';
import Conversation from '../components/Conversation';
import ConversationList from '../../../../components/Chat/Sidebar/ConversationList';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import PageHeader from '@/components/internal/PageHeader';
import EmptyStateFeedback from '@/components/EmptyStateFeedback';
import { Share2 } from 'lucide-react'; // Lucide replacement
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { defaultBrandSettings, deriveColors, getComputedColors } from '@/utils/colorUtils';

const ClientChatLayout = ({
  conversations,
  user,
  optimisticMarkLastMessageAsSeen,
  portal,
}) => {
  const navigate = useNavigate();
  const isLessThan768 = useMediaQuery({ query: '(max-width: 768px)' });
  const isLessThan1024 = useMediaQuery({ query: '(max-width: 1024px)' });
  const {setOpen } = useSidebar();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const conversationId = urlParams.get('conversation-id');
  const brandSettings = portal?.brand_settings || defaultBrandSettings

  const computedColors = useMemo(() => {
    return brandSettings.showAdvancedOptions 
      ? getComputedColors(brandSettings)     // Use advanced colors
      : deriveColors(brandSettings.baseColors); // Ignore advanced colors completely
  }, [brandSettings]);
   useEffect(() => {
    const conversationExists = conversations.find((conv) => conv.id === conversationId);
    if (conversationId && !conversationExists) {
      navigate('/portal/messages', { replace: true });
    }
  }, [conversations, conversationId, navigate]);

  useEffect(() => {
    if (conversations.length && !conversationId ) {
      if (!isLessThan768) {
        navigate(`/portal/messages?conversation-id=${conversations[0].id}`, { replace: true });
      } else if (conversations.length === 1) {
        navigate(`/portal/messages?conversation-id=${conversations[0].id}`, { replace: true });
      }
    }
  }, [conversations, conversationId, navigate]);

  if (conversations.length === 0) {
    return (
      <>
        <PageHeader
          title="Messages"
          description="Your chat history will appear here once portal owner start or join a conversation."
          showSidebar={true}
        />
        <div className="mt-16">
          <EmptyStateFeedback
            IconComponent={Share2}
            title="No conversations yet"
            message="Your chat history will appear here once the portal owner start or join a conversation."
            centered
          />
        </div>
      </>
    );
  }

  if (conversations.length === 1 && conversationId) {
    return (
      <div className="flex h-screen">
        <div className="flex-grow">
          <Conversation
          length={conversations.length}
            hasManyConversation={false}
            user={user}
            conversationId={conversationId}
            isClientExperience={true}
            conversations={conversations}
            colorSettings={computedColors}
            />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div
        className={`chat-layout fixed lg:inset-y-0  h-screen ${
          isLessThan768 ? 'w-full' : 'w-72'
        } flex lg:flex-col`}
      >
        {(!isLessThan768 || !conversationId) && (
          <div className="flex grow flex-col overflow-y-auto border-r border-gray-200 bg-white px-0">
            <div className='border-b pb-4'>
             
              <p className="px-4 pt-4 text-sm flex items-center gap-x-2"> 
                 {
                  isLessThan1024 && (
                    <SidebarTrigger onClick={() => setOpen(true)} />
                  )
                }
                  Conversations
              </p>
            </div>
            <nav className="flex flex-1 flex-col">
              <ConversationList
                portal={portal}
                optimisticMarkLastMessageAsSeen={optimisticMarkLastMessageAsSeen}
                convId={conversationId}
                isClientExperience={true}
                userId={user?.id}
                conversations={conversations}
                colorSettings={computedColors}
              />
            </nav>
          </div>
        )}
      </div>

      {conversationId && (
        <div className={`flex-grow ${isLessThan768 ? 'ml-0' : 'ml-72'}`}>
          <Conversation
                    length={conversations.length}

            hasManyConversation={true}
            conversations={conversations}
            isClientExperience={true}
            conversationId={conversationId}
            user={user}
            colorSettings={computedColors}
          />
        </div>
      )}
    </div>
  );
};

export default ClientChatLayout;

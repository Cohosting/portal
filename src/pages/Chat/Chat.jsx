import React, { useRef, useState } from 'react';
import ChatLayout from '../../components/Layouts/ChatLayout';
import { Layout } from './../Dashboard/Layout';
import { Outlet, useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { ConversationProvider } from '../../context/useConversationContext';
import { useChatConversations } from '../../hooks/react-query/useChat';
import { useSelector } from 'react-redux';

const Chat = () => {
    const isLessThan1100 = useMediaQuery({ query: '(max-width: 1024px)' });
    const { conversationId } = useParams();
    const [isConversationsListLoading, setIsConversationsListLoading] = useState(false)
    const { currentSelectedPortal } = useSelector(state => state.auth)
    const { conversations, isLoading, refetchConversations, optimisticMarkLastMessageAsSeen } = useChatConversations(currentSelectedPortal,)

    const isLessThan768 = useMediaQuery({ query: '(max-width: 768px)' });
    let showSidebar = !isLessThan1100;

 
    return (

        <Layout hideMobileNav={true} showSidebar={showSidebar} headerName='Messages' containerPaddingStyle={isLessThan1100 ? 'pl-0' : 'lg:pl-[13.7rem]'}  >
            <div className="flex">
                <ChatLayout
                    isLoading={isLoading}
                    conversations={conversations}
                    optimisticMarkLastMessageAsSeen={optimisticMarkLastMessageAsSeen}
                    setIsConversationsListLoading={setIsConversationsListLoading}

                />

                {(!isLessThan768 || conversationId) && (
                    <div className={`flex-grow   ${isLessThan768 ? 'ml-0' : 'ml-72'} `}>
                        <Outlet context={{
                            isConversationsListLoading,
                            conversations,
                            refetchConversations,
                        }} />
                    </div>
                )}

            </div>
        </Layout>
    )
}

export default Chat;

import React, { useState } from 'react';
import ChatLayout from '../../components/Layouts/ChatLayout';
import { Layout } from './../Dashboard/Layout';
import { Outlet, useParams } from 'react-router-dom';
import { useMediaQuery } from '@chakra-ui/react';
import { ConversationProvider } from '../../context/useConversationContext';

const Chat = () => {
    const [isLessThan1100] = useMediaQuery("(max-width: 1100px)");
    const { conversationId } = useParams();
    const [conversations, setConversations] = useState([]);
    const [isConversationsListLoading, setIsConversationsListLoading] = useState(false)

    const [isLessThan768] = useMediaQuery('(max-width: 768px)');
    let showSidebar = !isLessThan1100;


    return (

        <Layout hideMobileNav={true} showSidebar={showSidebar} headerName='Messages' containerPaddingStyle={isLessThan1100 ? 'pl-0' : 'lg:pl-[14rem]'}  >
            <div className="flex">
                <ChatLayout conversations={conversations} setConversations={setConversations} setIsConversationsListLoading={setIsConversationsListLoading} />

                {(!isLessThan768 || conversationId) && (
                    <div className={`flex-grow   ${isLessThan768 ? 'ml-0' : 'ml-72'} `}>
                        {/* Secondary column (hidden on smaller screens) */}
                        <Outlet context={{
                            isConversationsListLoading,
                            conversations
                        }} />
                    </div>
                )}

            </div>
        </Layout>
    )
}

export default Chat;

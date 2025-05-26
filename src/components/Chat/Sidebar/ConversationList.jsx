


import React from 'react'
import ConversationListItem from './ConversationListItem'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markAsSeen } from '../../../services/chat';
import _ from 'lodash';


const ConversationList = ({
    conversations,
    userId,
    isClientExperience = false,
    convId,
    optimisticMarkLastMessageAsSeen,
    portal,
    colorSettings
}) => {
    const location = useLocation()
    const navigate = useNavigate();
    const { conversationId } = useParams();

 
    return (
        <ul className='  border-t-0' >
            {conversations.map((conversation) => {
                let chat;
                const participants = conversation.participants;
                if (participants?.length === 1) {

                    if (location.pathname === '/portal/messages') {
                        chat = {
                            type: "individual",
                            avatar: participants[0]?.avatar_url,
                            // lodash make capitalize
                            name: _.capitalize(portal?.brand_settings?.brandName),
                        }
                    } else {
                        chat = {
                            type: "individual",
                            avatar: participants[0]?.avatar_url,
                            name: participants[0].name,
                        }
                    }


                } else if (participants?.length > 1) {
                    chat = {
                        type: "group",
                        avatars: participants?.map(participant => participant?.avatar_url),
                        name: conversation.name,
                    }
                }
                let seen = conversation?.last_message?.seen;
                const isUnread = (!seen || !seen.includes(userId)) && conversation.id !== (conversationId || convId);


                return (
                    <li className='border-y border-t-0' key={conversation.id}>
                        <ConversationListItem
                            {...conversation}
                            current={!isClientExperience ? conversation.id === conversationId : conversation.id === convId}
                            handleClick={async () => {
                                let currentConversation = conversations.find(conv => conv.id === conversation.id);
                                markAsSeen(currentConversation, userId)
                                optimisticMarkLastMessageAsSeen(currentConversation, userId);
                                if (isClientExperience) {
                                    navigate(`/portal/messages?conversation-id=${conversation.id}`)
                                    return;
                                }

                                navigate(`/messages/${conversation.id}`)
                            }}
                            chat={chat}
                            lastMessage={conversation?.last_message?.content}
                            lastMessageTime={conversation?.last_message?.created_at}
                            isUnread={isUnread}
                            colorSettings={colorSettings}
                        />
                    </li>
                )
            })}
        </ul>
    )
}

export default ConversationList
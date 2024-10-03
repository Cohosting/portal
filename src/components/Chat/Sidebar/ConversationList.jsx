


import React from 'react'
import ConversationListItem from './ConversationListItem'
import { useNavigate, useParams } from 'react-router-dom'
import { markAsSeen } from '../../../services/chat';


const ConversationList = ({
    conversations,
    userId,
    isClientExperience = false,
    convId,
    optimisticMarkLastMessageAsSeen
}) => {
    const navigate = useNavigate();
    const { conversationId } = useParams()
    return (
        <ul >
            {conversations.map((conversation) => {
                let chat;
                const participants = conversation.participants;
                console.log(participants)
                if (participants?.length === 1) {
                    chat = {
                        type: "individual",
                        avatar: participants[0]?.avatar_url,
                        name: participants[0].name,
                    }

                } else {
                    chat = {
                        type: "group",
                        avatars: participants?.map(participant => participant?.avatar_url),
                        name: conversation.name,
                    }
                }
                let seen = conversation?.last_message?.seen;
                console.log(conversation?.last_message)
                const isUnread = (!seen || !seen.includes(userId)) && conversation.id !== (conversationId || convId);


                return (
                    <li key={conversation.id}>
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
                        />
                    </li>
                )
            })}
        </ul>
    )
}

export default ConversationList



import React from 'react'
import ConversationListItem from './ConversationListItem'
import { useNavigate, useParams } from 'react-router-dom'

/* chat: {
        type: "individual",
        avatar: "",
        avatars: ["", ""],
        name: "Unknown User",
    } */
const ConversationList = ({
    conversations
}) => {
    const navigate = useNavigate();
    const { conversationId } = useParams()
    return (
        <ul >
            {conversations.map((conversation) => {
                let chat;
                const participants = conversation.participants;

                if (participants.length === 1) {
                    chat = {
                        type: "individual",
                        avatar: participants[0].avatar_url,
                        name: participants[0].name,
                    }

                } else {
                    chat = {
                        type: "group",
                        avatars: participants.map(participant => participant.avatar_url),
                        name: conversation.name,
                    }
                }

                return (
                    <li key={conversation.name}>
                        <ConversationListItem
                            {...conversation}
                            current={conversation.id === conversationId}
                            handleClick={() => navigate(`/messages/${conversation.id}`)}
                            chat={chat}
                            lastMessage={conversation?.last_message?.content}
                            lastMessageTime={conversation?.last_message?.created_at}
                        />
                    </li>
                )
            })}
        </ul>
    )
}

export default ConversationList
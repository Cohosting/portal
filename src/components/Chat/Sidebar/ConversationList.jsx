import React from 'react'
import ConversationListItem from './ConversationListItem'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markAsSeen } from '../../../services/chat'
import { capitalize } from '@/utils'

const ConversationList = ({
  conversations,
  userId,
  isClientExperience = false,
  convId,
  optimisticMarkLastMessageAsSeen,
  portal,
  colorSettings,
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { conversationId } = useParams()

  return (
    <ul className="border-t-0">
      {conversations.map((conversation) => {
        let chat
        const participants = conversation.participants

        if (participants?.length === 2) {
          // pick out the client when there are exactly two participants
          const client = participants.find(p => p.type === 'clients')
          const agent = participants.find(p => p.participant_type === 'users')
 

          if (location.pathname === '/portal/messages') {
            chat = {
              type: 'individual', 
              avatar: agent?.avatar_url,
              name: agent?.name
            }
          } else {
            chat = {
              type: 'individual',
              avatar: client?.avatar_url,
              name: client?.name,
            }
          }
        } else if (participants?.length > 2) {
          chat = {
            type: 'group',
            avatars: participants.map(p => p.avatar_url),
            name: conversation.name,
            participants
          }
        }

        const seen = conversation?.last_message?.seen
        const isUnread =
          (!seen || !seen.includes(userId)) &&
          conversation.id !== (conversationId || convId)

        return (
          <li className="border-y border-t-0" key={conversation.id}>
            <ConversationListItem
              {...conversation}
              participants={conversation.participants}
              current={
                !isClientExperience
                  ? conversation.id === conversationId
                  : conversation.id === convId
              }
              handleClick={async () => {
                const currentConversation = conversations.find(
                  conv => conv.id === conversation.id
                )
                markAsSeen(currentConversation, userId)
                optimisticMarkLastMessageAsSeen(currentConversation, userId)

                if (isClientExperience) {
                  navigate(`/portal/messages?conversation-id=${conversation.id}`)
                } else {
                  navigate(`/messages/${conversation.id}`)
                }
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

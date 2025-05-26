import React from 'react';
import MessageItem from './MessageItem';
import EmptyStateFeedback from '@/components/EmptyStateFeedback';
import { XCircle } from 'lucide-react';
import { MessagesSquare } from 'lucide-react';

const MessageList = ({ messages, user, hasMore, observeLastElement, colorSettings }) => {

    if (messages.length === 0) return ( <div className='mt-16'>

        <EmptyStateFeedback title={"No Messages Yet"} message="Looks like your inbox is empty. Start a conversation to see messages here." IconComponent={MessagesSquare} centered />
  </div> 
  )

    return (
        <div className='space-y-4 py-10'>

            {messages.map((message, index) => {

                const sender = message.sender;
                const isOwn = message?.sender?.id === user.id
                return (
                    <MessageItem
                        key={message.id}
                        isOwn={isOwn}
                        avatarSrc={sender?.avatar_url}
                        avatarInitial={message.name}
                        name={sender?.name}
                        attachments={message.attachments}
                        timestamp={message.timestamp}
                        content={message.content}
                        status={message.status}
                        id={message.id}
                        observeLastElement={index === messages.length - 1 ? observeLastElement : null}
                        colorSettings={colorSettings}

                    />
                )
            })}
        </div>
    );
};

export default MessageList;

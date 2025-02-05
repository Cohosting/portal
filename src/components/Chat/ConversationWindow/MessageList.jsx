import React from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages, user, hasMore, observeLastElement }) => {

    if (messages.length === 0) return <div className="text-center mt-4 text-gray-500">No messages yet</div>;

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

                    />
                )
            })}
        </div>
    );
};

export default MessageList;

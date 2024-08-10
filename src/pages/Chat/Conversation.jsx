import React, { useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ConversationHeader from '../../components/Chat/ConversationWindow/ConversationHeader';
import MessageInput from '../../components/Chat/ConversationWindow/MessageInput';
import MessageList from '../../components/Chat/ConversationWindow/MessageList';

import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { sendMessage } from '../../services/chat';
import { useRealtimeMessages } from '../../hooks/react-query/useChat';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import { Spinner } from '@phosphor-icons/react';

const Conversation = () => {
    const { conversationId } = useParams();
    const { isConversationsListLoading } = useOutletContext();
    const { isLoading, messages, setMessages } = useRealtimeMessages(conversationId);
    const [isFileUploading, setIsFileUploading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Scroll to bottom when messages are loaded or updated
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (content, selectedMood, selectedFiles, selectedFilePublicUrls) => {
        const id = uuidv4();
        const newMessage = {
            id,
            created_at: new Date().toISOString(),
            content,
            status: 'pending',
            conversation_id: conversationId,
            sender_id: user.id,
            sender: {
                id: user.id,
                name: user.name,
                avatar_url: user.avatar_url,
            },
            attachments: selectedFilePublicUrls,
        };

        // Optimistically update the UI
        setMessages((oldMessages) => [...oldMessages, newMessage]);

        try {
            const response = await sendMessage({
                ...newMessage,
                status: 'sent',
            });
            // Update the message status to 'sent'
            setMessages((oldMessages) =>
                oldMessages.map((msg) =>
                    msg.id === id ? { ...msg, status: 'sent', id: response.id } : msg
                )
            );
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((oldMessages) =>
                oldMessages.map((msg) =>
                    msg.id === id ? { ...msg, status: 'failed' } : msg
                )
            );
        }
    };

    const handleDeleteConversation = async () => {
        console.log('Delete Conversation');

        // Delete conversation from the database
        const { error } = await supabase.from('conversations').delete().eq('id', conversationId);
        if (error) {
            console.error('Error deleting conversation:', error);
        }

        // Error toast using react-toastify
        toast.success('Conversation deleted successfully', {
            style: {
                fontSize: '14px'
            }
        });



    }

    if (isConversationsListLoading) {
        return (<div className="flex justify-center mt-5 items-center">
            <Spinner className='animate-spin ' size={32} ></Spinner>
        </div>)
    }



    return (
        <div className="p-6 px-0 pt-0 pb-0 min-h-screen flex flex-col">
            {isLoading && (
                <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}

            {!messages && <div className="text-center mt-4">No messages</div>}

            <div className="sticky  px-6 shadow-sm top-0 bg-white z-10 py-3">
                <ConversationHeader
                    name={"Sterling Jones"}
                    handleDeleteConversation={handleDeleteConversation}
                />
            </div>

            <div className="flex-grow">
                <MessageList messages={messages} user={user} />
                <div ref={messagesEndRef} />
            </div>

            <div className="sticky px-6 bottom-0 w-full bg-white z-[100]">
                <MessageInput
                    isFileUploading={isFileUploading}
                    setIsFileUploading={setIsFileUploading}
                    onSendMessage={handleSendMessage}

                />
            </div>
        </div>
    );
};

export default Conversation;
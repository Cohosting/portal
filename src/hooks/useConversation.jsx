import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage } from '../services/chat';
import { useRealtimeMessages } from './react-query/useChat';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

export const useConversation = (conversationId, user, conversations) => {
  const {
    isLoading,
    messages,
    setMessages,
    fetchMoreMessages,
    hasMore,
    moreLoading,
    fetchedWay,
    error,
  } = useRealtimeMessages(conversationId, 15, conversations, user);

  const [isFileUploading, setIsFileUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);

  const handleFetchMore = useCallback(
    (listRef) => {
      console.log('Fetching more messages...');
      fetchMoreMessages(listRef, fetchedWay);
    },
    [fetchMoreMessages]
  );

  const handleSendMessage = useCallback(
    async (content, selectedMood, selectedFiles, selectedFilePublicUrls) => {
      console.log('handleSendMessage called with:', {
        content,
        selectedMood,
        selectedFiles,
        selectedFilePublicUrls,
      });
      if (!content) return;

      const tempId = uuidv4();
      const newMessage = {
        id: tempId,
        created_at: new Date().toISOString(),
        content,
        status: 'sending',
        conversation_id: conversationId,
        sender_id: user.id,
        sender: {
          id: user.id,
          name: user.name,
          avatar_url: user?.avatar_url,
        },
        attachments: selectedFilePublicUrls,
        seen: [user.id],
      };

      console.log('New message created:', newMessage);

      // Add the temporary message to the state
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        const response = await sendMessage({
          ...newMessage,
          status: 'sent',
        });
        console.log('Message sent successfully:', response);

        // Update the temporary message with the response from the server
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId ? { ...msg, status: 'sent', id: response.id } : msg
          )
        );
      } catch (error) {
        console.error('Error sending message:', error);

        // Update the message status to 'failed' if there's an error
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId ? { ...msg, status: 'failed' } : msg
          )
        );
      }

      console.log('handleSendMessage execution completed');
    },
    [conversationId, user, messages, setMessages]
  );

  const handleDeleteConversation = useCallback(async () => {
    console.log('Delete Conversation');
    const { error } = await supabase.from('conversations').update({
      status: 'deleted',
    }).eq('id', conversationId);
    if (error) {
      console.error('Error deleting conversation:', error);
    }
    toast.success('Conversation deleted successfully', {
      style: {
        fontSize: '14px',
      },
    });
  }, [conversationId]);

  return {
    isLoading,
    messages,
    hasMore,
    moreLoading,
    isFileUploading,
    setIsFileUploading,
    user,
    messagesEndRef,
    messageListRef,
    handleFetchMore,
    handleSendMessage,
    handleDeleteConversation,
    fetchedWay,
    error
  };
};
import { supabase } from '../lib/supabase';

/**
 * Creates a new conversation with participants.
 *
 * @param {Object} conversationData - The data for the conversation.
 * @param {string} conversationData.name - The name of the conversation.
 * @param {string} conversationData.portal_id - The portal ID associated with the conversation.
 * @param {Array<string>} participantIds - The IDs of the participants.
 * @returns {Promise<Object>} The created conversation data.
 * @throws Will throw an error if the conversation creation fails.
 */
export const createConversation = async (conversationData, participantIds) => {
  const { data, error } = await supabase.rpc(
    'create_conversation_with_participants',
    {
      conversation_name: conversationData.name,
      portal_id: conversationData.portal_id,
      participant_ids: participantIds,
    }
  );

  if (error) {
    console.error('Error creating conversation with participants:', error);
    throw error;
  }

  return data;
};

/**
 * Fetches conversations for a given portal ID.
 *
 * @param {string} portal_id - The portal ID to fetch conversations for.
 * @returns {Promise<Array<Object>>} The list of conversations.
 */
export const fetchConversations = async portal_id => {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(
      `
    id,
    name,
    created_at,
    updated_at,
    participants:users!inner(id, name, avatar_url),
    last_message:last_message_id(id, content, created_at)
  `
    )
    .eq('portal_id', portal_id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  const transformedConversations = conversations.map(conv => ({
    ...conv,
    participants: conv.participants,
  }));

  return transformedConversations;
};

/**
 * Sends a message in a conversation.
 *
 * @param {Object} newMessage - The message data.
 * @param {string} newMessage.id - The ID of the message.
 * @param {string} newMessage.created_at - The creation timestamp of the message.
 * @param {string} newMessage.content - The content of the message.
 * @param {string} newMessage.status - The status of the message.
 * @param {string} newMessage.conversation_id - The ID of the conversation.
 * @param {string} newMessage.sender_id - The ID of the sender.
 * @param {Object} newMessage.sender - The sender's information.
 * @param {string} newMessage.sender.id - The ID of the sender.
 * @param {string} newMessage.sender.name - The name of the sender.
 * @param {string} newMessage.sender.avatar_url - The avatar URL of the sender.
 * @param {Array<string>} newMessage.attachments - The attachments of the message.
 * @returns {Promise<Object>} The sent message data.
 * @throws Will throw an error if the message sending fails.
 */
export const sendMessage = async newMessage => {
  const { sender, ...message } = newMessage;
  const { data, error } = await supabase
    .from('messages')
    .insert({
      ...message,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Fetches messages for a given conversation ID.
 *
 * @param {string} conversation_id - The ID of the conversation to fetch messages for.
 * @returns {Promise<Array<Object>>} The list of messages.
 */
export const fetchMessages = async conversation_id => {
  const { data: messages, error } = await supabase
    .from('messages')
    .select(
      `
      id,
      content,
      created_at,
      status,
      sender:sender_id (id, name, avatar_url),
      attachments
    `
    )
    .eq('conversation_id', conversation_id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return messages;
};

export const markAsSeen = async (conversation, userId) => {
  console.log({
    conversation,
    user_id: userId,
  });
  if (conversation?.last_message?.id) {
    const { error } = await supabase.rpc('mark_message_seen', {
      message_id: conversation.last_message?.id,
      user_id: userId,
    });
    if (error) console.error('Error marking as seen:', error);
    return {
      message: 'Marked as seen',
    };
  }
};

/**
 * Creates and sends a mass message to multiple participants.
 *
 * @param {Object} messageData - The data for the message.
 * @param {string} messageData.id - The ID of the message.
 * @param {string} messageData.created_at - The creation timestamp of the message.
 * @param {string} messageData.content - The content of the message.
 * @param {string} messageData.status - The status of the message.
 * @param {string} messageData.conversation_id - The ID of the conversation.
 * @param {string} messageData.sender_id - The ID of the sender.
 * @param {Object} messageData.sender - The sender's information.
 * @param {string} messageData.sender.id - The ID of the sender.
 * @param {string} messageData.sender.name - The name of the sender.
 * @param {string} messageData.sender.avatar_url - The avatar URL of the sender.
 * @param {Array<string>} messageData.attachments - The attachments of the message.
 * @param {Array<string>} participantIds - The IDs of the participants.
 * @returns {Promise<void>}
 */
// Function to create and send a mass message to multiple participants
export const createMassMessage = async (
  messageData,
  participantIds,
  portal_id
) => {
  // Create a function to handle message sending per participant
  const handleParticipant = async participantId => {
    // Fetch all conversations for this participant in the specified portal
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(
        `
        conversation_id,
        conversations (
          id,
          portal_id,
          status
        )
      `
      )
      .eq('user_id', participantId)
      .eq('conversations.portal_id', portal_id);

    if (error) {
      console.error('Error fetching conversation participants:', error);
      return; // Skip to the next participant
    }
    console.log({
      data,
    });

    if (data && data.length > 0) {
      // User is part of existing conversations in this portal
      const messagePromises = data.map(async item => {
        if (item.conversations) {
          // Check if this is a one-on-one conversation
          const { count, error: countError } = await supabase
            .from('conversation_participants')
            .select('id', { count: 'exact' })
            .eq('conversation_id', item.conversations.id);

          if (countError) {
            console.error(
              'Error counting conversation participants:',
              countError
            );
            return;
          }

          if (count === 1) {
            // One-on-one conversation (2 participants)
            await sendMessage({
              ...messageData,
              conversation_id: item.conversations.id,
            });
          }
        }
      });

      await Promise.all(messagePromises); // Send messages concurrently
    } else {
      // User is not part of any active conversation in this portal, create a new one
      console.log(
        `Creating new conversation for participant: ${participantId}`
      );
      const new_conversation_id = await createConversation(
        {
          name: `Mass Message - ${new Date().toISOString()}`,
          portal_id: portal_id,
        },
        [participantId]
      );

      if (new_conversation_id) {
        await sendMessage({
          ...messageData,
          conversation_id: new_conversation_id,
        });
      } else {
        console.error(
          'Failed to create new conversation for participant:',
          participantId
        );
      }
    }
  };

  // Use Promise.all to handle all participants in parallel
  const participantPromises = participantIds.map(handleParticipant);
  await Promise.all(participantPromises); // Wait for all participants to be processed
};
export const updateMessage = async (messageId, content) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ content })
    .eq('id', messageId)
    .single();

  if (error) {
    console.error('Error updating message:', error);
    throw error;
  }

  return data;
};

export const fetchInitialMessages = async (conversationId, initialLimit) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:sender_id (id, name, avatar_url)')
      .eq('conversation_id', conversationId)
      .limit(initialLimit)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: data.reverse(), hasMore: data.length === initialLimit };
  } catch (error) {
    console.error('Error fetching initial messages:', error);
    throw error;
  }
};

export const fetchSender = async senderId => {
  try {
    const { data: sender, error } = await supabase
      .from('users')
      .select('id, name, avatar_url')
      .eq('id', senderId)
      .single();

    if (error) throw error;

    return sender;
  } catch (error) {
    console.error('Error fetching sender information:', error);
    throw error;
  }
};

export const handleRealtimePayload = async (
  payload,
  setMessages,
  fetchSender,
  messages
) => {
  const { new: newMessage, old: oldMessage } = payload;

  console.log({ newMessage, oldMessage });
  if (newMessage && !Object.keys(oldMessage).length) {
    console.log('New message:', newMessage);
    // Handle INSERT
    const sender = await fetchSender(newMessage.sender_id);
    if (sender) {
      newMessage.sender = sender;
    }
    setMessages(prevMessages =>
      prevMessages.some(msg => msg.id === newMessage.id)
        ? prevMessages
        : [...prevMessages, newMessage]
    );
  } else if (newMessage && oldMessage) {
    console.log(`Updating message ${newMessage.id}`);
    // Handle UPDATE
    const sender = await fetchSender(newMessage.sender_id);
    if (sender) {
      newMessage.sender = sender;
    }
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === newMessage.id ? { ...msg, ...newMessage } : msg
      )
    );
  } else if (!newMessage && oldMessage) {
    // Handle DELETE
    setMessages(prevMessages =>
      prevMessages.filter(msg => msg.id !== oldMessage.id)
    );
  }
};

export const fetchMoreMessages = async (
  conversationId,
  initialLimit,
  messages,
  listRef,
  setMessages,
  setHasMore,
  setError,
  fetchedWay
) => {
  const currentScrollPosition = listRef.current.scrollTop;
  const currentScrollHeight = listRef.current.scrollHeight;

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:sender_id (id, name, avatar_url)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .range(messages.length, messages.length + initialLimit - 1);

    if (error) throw error;

    setMessages(prevMessages => [...data.reverse(), ...prevMessages]);
    setHasMore(data.length === initialLimit);
    fetchedWay.current = 'LOAD_MORE';

    setTimeout(() => {
      const newScrollHeight = listRef.current.scrollHeight;
      const heightDifference = newScrollHeight - currentScrollHeight;
      listRef.current.scrollTop = currentScrollPosition + heightDifference;
    }, 0);
  } catch (error) {
    console.error('Error fetching more messages:', error);
    setError(error);
  }
};

export const fetchConversationById = async (conversationId, clientId) => {
  const { data, error } = await supabase
    .from('conversations')
    .select(
      `
      * ,
      participants:users!inner(id, name, avatar_url),
      last_message:last_message_id(id, content, seen, created_at)
          conversation_participants!inner(user_id)

    `
    )
    .eq('id', conversationId)
    .single();

  if (error) {
    console.error('Error fetching conversation:', error);
    return null;
  }

  return data;
};

export const deleteMessage = async messageId => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);
  if (error) throw error;
};

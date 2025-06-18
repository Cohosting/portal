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
export const createConversation = async (conversationData, participants) => {
  const { data, error } = await supabase.rpc(
    'create_conversation_with_participants',
    {
      conversation_name: conversationData.name,
      portal_id: conversationData.portal_id,
      participants,
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
  portal_id,
  currentUserId
) => {
  // 1. Fetch all conversations + participants via RPC
  const { data: convs = [], error: convErr } = await supabase.rpc(
    "fetch_conversations_with_participants",
    { _portal_id: portal_id }
  );
  if (convErr) throw convErr;

  // 2. Process each client
  for (const clientId of participantIds) {
    // Find an existing one-on-one conversation between user and this client
    const existing = convs.find(c => {
      const pts = c.participants || [];
      return (
        pts.length === 2 &&
        pts.some(p => p.participant_id === clientId && p.type === "clients") &&
        pts.some(p => p.participant_id === currentUserId && p.type === "users")
      );
    });

    let conversationId;
    if (existing) {
      conversationId = existing.id;
    } else {
      // Create a new conversation with both client and user
      const participants = [
        { type: "clients", id: clientId },
        { type: "users",   id: currentUserId }
      ];
      const { data: newId, error: newErr } = await supabase.rpc(
        "create_conversation_with_participants",
        {
          conversation_name: `Mass Message - ${new Date().toISOString()}`,
          portal_id,
          participants
        }
      );
      if (newErr) throw newErr;
      conversationId = newId;
    }

    // 3. Send the message into that conversation using existing helper
    await sendMessage({
      conversation_id: conversationId,
      ...messageData,
      sender_id: currentUserId
    });
  }
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

// need to update this to be polyphormic

export const fetchInitialMessages = async (conversationId, initialLimit) => {
  try {
    const { data, error } = await supabase.rpc('fetch_initial_messages', {
      conversation_id_param: conversationId,
      initial_limit_param: initialLimit,
    });

    if (error) throw error;

    // Transform the data to match your expected format
    const transformedData = data.map(message => ({
      ...message,
      sender: {
        id: message.sender_id,
        name: message.sender_name,
        avatar_url: message.sender_avatar_url,
        sender_type: message.sender_type, // Include sender_type in the sender object
      }
    })).reverse(); // Reverse since we ordered DESC in SQL

    return { 
      data: transformedData, 
      hasMore: data.length === initialLimit 
    };
  } catch (error) {
    console.error('Error fetching initial messages:', error);
    throw error;
  }
};

export const fetchSender = async (senderType, senderId) => {
  try {
    const { data, error } = await supabase.rpc('fetch_sender', {
      sender_type_param: senderType,
      sender_id_param: senderId,
    });

    if (error) throw error;

    return data?.[0] || null; // Return first result or null
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
    const sender = await fetchSender(newMessage.sender_type, newMessage.sender_id); // ✅ CHANGED: Added sender_type parameter
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
    const sender = await fetchSender(newMessage.sender_type, newMessage.sender_id); // ✅ CHANGED: Added sender_type parameter
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
  if (!listRef.current) return;
  
  const scrollContainer = listRef.current;
  const oldScrollHeight = scrollContainer.scrollHeight;
  const oldScrollTop = scrollContainer.scrollTop;

  console.log('🔍 BEFORE FETCH:', {
    oldScrollHeight,
    oldScrollTop,
    messagesLength: messages.length
  });

  try {
    const { data, error } = await supabase
      .rpc('fetch_more_messages', {
        conversation_id_param: conversationId,
        offset_param: messages.length,
        limit_param: initialLimit
      });

    if (error) throw error;

    console.log('📦 FETCHED DATA:', {
      newMessagesCount: data.length,
      hasMore: data.length === initialLimit
    });

    const transformedData = data.map(message => ({
      ...message,
      sender: {
        id: message.sender_id,
        name: message.sender_name,
        avatar_url: message.sender_avatar_url
      }
    }));

    // Store scroll info for the useEffect to use
    fetchedWay.current = {
      type: 'LOAD_MORE',
      oldScrollHeight,
      oldScrollTop
    };

    setMessages(prevMessages => [...transformedData.reverse(), ...prevMessages]);
    setHasMore(data.length === initialLimit);
    
  } catch (error) {
    console.error('Error fetching more messages:', error);
    setError(error);
  }
};

export const fetchConversationById = async (conversationId) => {
  try {
    const { data, error } = await supabase
      .rpc('fetch_conversation_by_id', {
        _conversation_id: conversationId
      });

    if (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }

    // The RPC returns an array, but we want a single conversation
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return null;
  }
};

export const deleteMessage = async messageId => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);
  if (error) throw error;
};

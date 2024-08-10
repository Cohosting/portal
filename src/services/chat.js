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
  for (const participantId of participantIds) {
    // Fetch all conversations for this participant in the specified portal
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(
        `
        conversation_id,
        conversations (
          id,
          portal_id
        )
      `
      )
      .eq('user_id', participantId)
      .eq('conversations.portal_id', portal_id);

    if (error) {
      console.error('Error fetching conversation participants:', error);
      continue; // Continue with the next participant
    }

    if (data && data.length > 0) {
      // User is part of existing conversations in this portal
      for (const item of data) {
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
            continue;
          }

          if (count === 1) {
            // One-on-one conversation (2 participants)
            await sendMessage({
              ...messageData,
              conversation_id: item.conversations.id,
            });
          }
        }
      }
    } else {
      // User is not part of any conversation in this portal, create a new one
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

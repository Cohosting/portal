CREATE OR REPLACE FUNCTION create_conversation_with_participants(
  conversation_name TEXT,
  portal_id UUID,
  participant_ids UUID[]
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_conversation_id UUID;
BEGIN
  -- Insert the new conversation
  INSERT INTO conversations (name, portal_id)
  VALUES (conversation_name, portal_id)
  RETURNING id INTO new_conversation_id;

  -- Insert participants
  INSERT INTO conversation_participants (conversation_id, user_id)
  SELECT new_conversation_id, unnest(participant_ids);

  -- Return the new conversation ID
  RETURN new_conversation_id;
END;
$$;
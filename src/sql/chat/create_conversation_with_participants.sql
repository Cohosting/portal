-- Drop and recreate the function to ensure search_path is properly set
DROP FUNCTION IF EXISTS create_conversation_with_participants(TEXT, UUID, JSONB);

CREATE FUNCTION create_conversation_with_participants(
  conversation_name TEXT,
  portal_id        UUID,
  participants     JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_conversation_id UUID;
  part                JSONB;
  p_type              TEXT;
  p_id                UUID;
BEGIN
  -- 1. Create the conversation
  INSERT INTO public.conversations (name, portal_id)
    VALUES (conversation_name, portal_id)
    RETURNING id INTO new_conversation_id;

  -- 2. Loop through each element in the JSONB array
  FOR part IN SELECT * FROM jsonb_array_elements(participants) LOOP
    p_type := part->>'type';
    p_id   := (part->>'id')::UUID;

    -- 3. Insert into the polymorphic participants table
    INSERT INTO public.conversation_participants (
      conversation_id,
      participant_type,
      participant_id,
      created_at
    )
    VALUES (
      new_conversation_id,
      p_type,
      p_id,
      now()
    );
  END LOOP;

  -- 4. Return the new conversation's ID
  RETURN new_conversation_id;
END;
$$;
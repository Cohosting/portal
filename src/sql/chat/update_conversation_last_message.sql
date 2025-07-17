CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the conversation's last_message_id is null
  IF (SELECT last_message_id FROM public.conversations WHERE id = OLD.conversation_id) IS NULL THEN
    -- Find the most recent message for this conversation
    WITH latest_message AS (
      SELECT id
      FROM public.messages
      WHERE conversation_id = OLD.conversation_id
      ORDER BY created_at DESC
      LIMIT 1
    )
    -- Update the conversation's last_message_id
    UPDATE public.conversations
    SET last_message_id = (SELECT id FROM latest_message)
    WHERE id = OLD.conversation_id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';

-- Create a trigger that runs this function after a message is deleted
CREATE TRIGGER update_conversation_after_message_delete
AFTER DELETE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();
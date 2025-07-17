CREATE FUNCTION update_last_seen(
    p_conversation_id UUID,
    p_user_id UUID,
    p_message_id UUID,
    p_client_counter BIGINT
) RETURNS VOID AS $$
DECLARE
    v_current_counter BIGINT;
    v_current_last_seen UUID;
BEGIN
    -- Get the current counter and last seen message for the user
    SELECT update_counter, (last_seen_by->>p_user_id::text)::UUID
    INTO v_current_counter, v_current_last_seen
    FROM public.conversations
    WHERE id = p_conversation_id
    FOR UPDATE;

    -- Debugging: Raise Notice
    RAISE NOTICE 'Current counter: %, Last Seen: %', v_current_counter, v_current_last_seen;

    -- Only update if the client's counter is greater than or equal to the server's counter
    -- and the new message_id is more recent than the current last_seen
    IF p_client_counter >= v_current_counter AND
        (v_current_last_seen IS NULL OR p_message_id > v_current_last_seen) THEN
        UPDATE public.conversations
        SET last_seen_by = jsonb_set(
                              COALESCE(last_seen_by, '{}'),  -- Handle NULL JSONB by replacing with an empty object
                              ARRAY[p_user_id::text],
                              to_jsonb(p_message_id::text)
                          ),
            update_counter = v_current_counter + 1
        WHERE id = p_conversation_id;

        -- Debugging: Raise Notice after update
        RAISE NOTICE 'Updated last_seen_by for user: %, new message_id: %', p_user_id, p_message_id;
    ELSE
        -- Debugging: Raise Notice when not updating
        RAISE NOTICE 'No update performed. Client counter: %, Current counter: %, Message ID: %, Last Seen: %',
                     p_client_counter, v_current_counter, p_message_id, v_current_last_seen;
    END IF;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';
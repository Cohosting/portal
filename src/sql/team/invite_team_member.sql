CREATE OR REPLACE FUNCTION invite_team_member(
    p_member_data JSONB,
    p_seat_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_member_id UUID;
    v_invitation_id UUID;
    v_invite_url TEXT;
    v_portal_id UUID;
    v_new_seat_id UUID;
    v_new_seat_number NUMERIC;
BEGIN
    v_portal_id := (p_member_data->>'portal_id')::UUID;

    -- Always create a new seat
    SELECT COALESCE(MAX(seat_number), 0) + 1
    INTO v_new_seat_number
    FROM public.seats
    WHERE portal_id = v_portal_id;

    INSERT INTO public.seats (
        portal_id,
        status,
        seat_type,
        seat_number
    ) VALUES (
        v_portal_id,
        'reserved',
        'paid',
        v_new_seat_number
    )
    RETURNING id INTO v_new_seat_id;

    p_seat_id := v_new_seat_id;

    v_invitation_id := (p_member_data->>'invitation_id')::UUID;

    INSERT INTO invitations (
        id,
        email,
        portal_id,
        invited_by,
        invitation_token,
        token_expires_at
    )
    VALUES (
        v_invitation_id,
        p_member_data->>'email',
        v_portal_id,
        (p_member_data->>'invited_by')::UUID,
        p_member_data->>'invitation_token',
        (p_member_data->>'token_expires_at')::TIMESTAMP WITH TIME ZONE
    );

    v_invite_url := '/invitations/' || v_invitation_id::TEXT || '/accept/' || (p_member_data->>'invitation_token');

    UPDATE invitations
    SET invite_url = v_invite_url
    WHERE id = v_invitation_id;

    INSERT INTO team_members (
        portal_id,
        email,
        name,
        user_id,
        status,
        role,
        created_at,
        seat_id
    )
    VALUES (
        v_portal_id,
        p_member_data->>'email',
        p_member_data->>'name',
        (p_member_data->>'user_id')::UUID,
        'pending',
        COALESCE(p_member_data->>'role', 'member'),
        NOW(),
        p_seat_id
    )
    RETURNING id INTO v_member_id;

    UPDATE invitations
    SET team_member_id = v_member_id
    WHERE id = v_invitation_id;

    UPDATE seats
    SET team_member_id = v_member_id,
        user_id = (p_member_data->>'user_id')::UUID
    WHERE id = p_seat_id;

    RETURN jsonb_build_object(
        'member_id', v_member_id,
        'invitation_id', v_invitation_id,
        'invite_url', v_invite_url,
        'seat_id', p_seat_id
    );
END;
$$;
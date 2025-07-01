CREATE OR REPLACE FUNCTION public.remove_team_member(team_member_id uuid)
RETURNS TABLE (portal_id uuid, subscription_id uuid)  -- pass back for Stripe sync
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    seat_id_var uuid;
    portal_id_var uuid;
    subscription_id_var uuid;
BEGIN
    -- Get the seat associated with the team member
    SELECT seat_id, portal_id
    INTO seat_id_var, portal_id_var
    FROM public.team_members
    WHERE id = team_member_id;

    -- Lookup subscription ID from the portal (assumes portal table contains it)
    SELECT subscription_id INTO subscription_id_var
    FROM public.portals
    WHERE id = portal_id_var;

    -- Delete seat if it exists
    IF seat_id_var IS NOT NULL THEN
        DELETE FROM public.seats WHERE id = seat_id_var;
    END IF;

    -- Delete the team member
    DELETE FROM public.team_members WHERE id = team_member_id;

    -- Return data for Stripe sync
    RETURN QUERY SELECT portal_id_var, subscription_id_var;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_team_member(uuid) TO authenticated;

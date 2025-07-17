CREATE OR REPLACE FUNCTION public.remove_team_member(
    team_member_id uuid
)
RETURNS TABLE (
    portal_id       uuid,
    subscription_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path =  public
AS $$
DECLARE
    seat_id_var          uuid;
    portal_id_var        uuid;
    subscription_id_var  text;
BEGIN
    -- fetch seat & portal
    SELECT seat_id, portal_id
      INTO seat_id_var, portal_id_var
    FROM public.team_members
    WHERE id = team_member_id;

    IF portal_id_var IS NULL THEN
        RAISE NOTICE 'No team member found for ID: %', team_member_id;
        RETURN QUERY SELECT NULL::uuid, NULL::text;
        RETURN;
    END IF;

    -- fetch external subscription ID (as text)
    SELECT subscription_id
      INTO subscription_id_var
    FROM public.portals
    WHERE id = portal_id_var;

    -- delete seat if present
    IF seat_id_var IS NOT NULL THEN
        DELETE FROM public.seats
         WHERE id = seat_id_var;
    END IF;

    -- delete the team member record
    DELETE FROM public.team_members
     WHERE id = team_member_id;

    -- return for Stripe sync
    RETURN QUERY SELECT portal_id_var, subscription_id_var;
END;
$$;

 

GRANT EXECUTE ON FUNCTION public.remove_team_member(uuid) TO authenticated;

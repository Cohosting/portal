CREATE FUNCTION public.sign_up_user_with_portal_and_seat(
  user_id    UUID,
  user_email TEXT
) RETURNS JSON AS $$
DECLARE
  new_user_id       UUID;
  new_portal_id     UUID;
  new_seat_id       UUID;
  new_team_member_id UUID;
  result            JSON;
  default_app       RECORD;
BEGIN
  -- 1. Create user
  INSERT INTO public.users (
    id, email, additional_data, is_profile_completed, portals, default_portal
  )
  VALUES (
    user_id, user_email, '{}', false, '{}'::UUID[], NULL
  )
  RETURNING id INTO new_user_id;

  -- 2. Create portal
  INSERT INTO public.portals (
    created_by, settings, brand_settings
  )
  VALUES (
    new_user_id,
    jsonb_build_object('ach_debit', true, 'card', false, 'auto_import', false),
    jsonb_build_object(
      'poweredByCopilot', false,
      'sidebarBgColor', '#1E293B',
      'sidebarTextColor', '#CBD5E1',
      'sidebarActiveTextColor', '#38BDF8',
      'accentColor', '#5b749a',
      'loginFormTextColor', '#eeeff1',
      'loginButtonColor', '#49628a',
      'loginButtonTextColor', '#fff5f5',
      'squareIcon', '', 'fullLogo', '', 'squareLoginImage', ''
    )
  )
  RETURNING id INTO new_portal_id;

  -- 3. Create default portal apps
  FOR default_app IN (
    SELECT 'Messages' AS name, 'messages' AS icon, 0 AS index, true AS is_default UNION ALL
    SELECT 'Billings', 'billings', 1, true UNION ALL
    SELECT 'Files', 'files', 2, true
  ) LOOP
    INSERT INTO public.portal_apps (
      id, portal_id, icon, index, is_default, name, created_by, settings
    )
    VALUES (
      gen_random_uuid(), new_portal_id, default_app.icon,
      default_app.index, default_app.is_default,
      default_app.name, new_user_id, '{}'::jsonb
    );
  END LOOP;

  -- 4. Create a single seat with seat_number = 1
  INSERT INTO public.seats (portal_id, status, user_id, seat_type, seat_number)
  VALUES (new_portal_id, 'available', NULL, 'free', 1)
  RETURNING id INTO new_seat_id;

  -- 5. Create team member
  INSERT INTO public.team_members (
    portal_id, email, user_id, status, role, seat_id
  )
  VALUES (
    new_portal_id, user_email, new_user_id, 'active', 'owner', new_seat_id
  )
  RETURNING id INTO new_team_member_id;

  -- 6. Update seat with user/team member info
  UPDATE public.seats
  SET
    user_id = new_user_id,
    status = 'occupied',
    team_member_id = new_team_member_id
  WHERE id = new_seat_id;

  -- 7. Update user with portal_id and default_portal
  UPDATE public.users
  SET 
    portals = array_append(portals, new_portal_id),
    default_portal = new_portal_id
  WHERE id = new_user_id;

  -- Prepare result
  SELECT json_build_object(
    'user',        (SELECT row_to_json(u) FROM public.users u WHERE u.id = new_user_id),
    'portal',      (SELECT row_to_json(p) FROM public.portals p WHERE p.id = new_portal_id),
    'seat',        (SELECT row_to_json(s) FROM public.seats s WHERE s.id = new_seat_id),
    'team_member', (SELECT row_to_json(tm) FROM public.team_members tm WHERE tm.id = new_team_member_id),
    'portal_apps', (SELECT json_agg(row_to_json(pa)) FROM public.portal_apps pa WHERE pa.portal_id = new_portal_id)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = '';
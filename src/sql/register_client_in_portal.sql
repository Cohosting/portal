CREATE OR REPLACE FUNCTION public.register_client_in_portal(
  p_email TEXT,
  p_name TEXT,
  p_portal_id UUID,
  p_stripe_customer_id TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_client_id UUID;
  v_result JSON;
BEGIN
  -- Insert the client and get the new ID
  INSERT INTO public.clients (email, name, status, portal_id, customer_id)
  VALUES (p_email, p_name, 'restricted', p_portal_id, p_stripe_customer_id)
  RETURNING id INTO v_client_id;

  -- Update portal's member list using the existing function
  -- Note: We need to cast v_client_id to TEXT here if add_member_to_portal expects TEXT
  PERFORM add_member_to_portal(p_portal_id, v_client_id::TEXT);

  -- Insert user
  INSERT INTO public.users (id, email, name, role, portal_id, avatar_url)
  VALUES (v_client_id, p_email, p_name, 'client', p_portal_id, '');

  -- Prepare the result
  SELECT json_build_object(
    'id', c.id,
    'email', c.email,
    'name', c.name,
    'status', c.status,
    'portal_id', c.portal_id,
    'stripe_customer_id', c.customer_id
  ) INTO v_result
  FROM public.clients c
  WHERE c.id = v_client_id;

  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;
-- RPC function to fetch sender information based on type and id
CREATE OR REPLACE FUNCTION fetch_sender(
  sender_type_param text,
  sender_id_param uuid
)
RETURNS TABLE (
  id uuid,
  name text,
  avatar_url text,
  sender_type text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF sender_type_param = 'users' THEN
    RETURN QUERY
    SELECT 
      u.id,
      u.name,
      u.avatar_url,
      'users'::text as sender_type
    FROM public.users u
    WHERE u.id = sender_id_param;
  ELSIF sender_type_param = 'clients' THEN
    RETURN QUERY
    SELECT 
      c.id,
      c.name,
      c.avatar_url,
      'clients'::text as sender_type
    FROM public.clients c
    WHERE c.id = sender_id_param;
  END IF;
END;
$$;
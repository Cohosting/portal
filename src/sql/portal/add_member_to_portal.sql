
CREATE FUNCTION add_member_to_portal(portal_id UUID, member_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.portals
  SET clients = array_append(clients, member_id)
  WHERE id = portal_id;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';
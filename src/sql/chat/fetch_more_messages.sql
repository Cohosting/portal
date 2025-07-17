-- RPC function to fetch more messages with polymorphic sender information
CREATE FUNCTION fetch_more_messages(
  conversation_id_param uuid,
  offset_param integer,
  limit_param integer
)
RETURNS TABLE (
  id uuid,
  created_at timestamp with time zone,
  content text,
  sender_type text,
  sender_id uuid,
  conversation_id uuid,
  status text,
  attachments jsonb[],
  updated_at timestamp with time zone,
  seen uuid[],
  sender_name text,
  sender_avatar_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.created_at,
    m.content,
    m.sender_type,
    m.sender_id,
    m.conversation_id,
    m.status,
    m.attachments,
    m.updated_at,
    m.seen,
    CASE 
      WHEN m.sender_type = 'users' THEN u.name
      WHEN m.sender_type = 'clients' THEN c.name
      ELSE NULL
    END as sender_name,
    CASE 
      WHEN m.sender_type = 'users' THEN u.avatar_url
      WHEN m.sender_type = 'clients' THEN c.avatar_url
      ELSE NULL
    END as sender_avatar_url
  FROM public.messages m
  LEFT JOIN public.users u ON m.sender_type = 'users' AND m.sender_id = u.id
  LEFT JOIN public.clients c ON m.sender_type = 'clients' AND m.sender_id = c.id
  WHERE m.conversation_id = conversation_id_param
  ORDER BY m.created_at DESC
  LIMIT limit_param
  OFFSET offset_param;
END;
$$;
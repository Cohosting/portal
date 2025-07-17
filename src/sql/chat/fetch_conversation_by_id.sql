CREATE FUNCTION public.fetch_conversation_by_id(
  _conversation_id UUID
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  name TEXT,
  updated_at TIMESTAMPTZ,
  portal_id UUID,
  status TEXT,
  last_message JSONB,
  participants JSONB
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
WITH last_msgs AS (
  SELECT
    m.conversation_id,
    jsonb_build_object(
      'id', m.id,
      'content', m.content,
      'seen', m.seen,
      'created_at', m.created_at
    ) AS last_msg
  FROM public.messages m
  WHERE m.conversation_id = _conversation_id
  ORDER BY m.created_at DESC
  LIMIT 1
),
agg_participants AS (
  SELECT
    cp.conversation_id,
    jsonb_agg(
      jsonb_build_object(
        'id', cp.id,
        'participant_type', cp.participant_type,
        'participant_id', cp.participant_id,
        'name',
          CASE
            WHEN cp.participant_type = 'users' THEN u.name
            WHEN cp.participant_type = 'clients' THEN c.name
          END,
        'avatar_url',
          CASE
            WHEN cp.participant_type = 'users' THEN u.avatar_url
            WHEN cp.participant_type = 'clients' THEN c.avatar_url
          END
      )
    ) AS parts
  FROM public.conversation_participants cp
  LEFT JOIN public.users u ON cp.participant_type = 'users' AND cp.participant_id = u.id
  LEFT JOIN public.clients c ON cp.participant_type = 'clients' AND cp.participant_id = c.id
  WHERE cp.conversation_id = _conversation_id
  GROUP BY cp.conversation_id
)
SELECT
  c.id,
  c.created_at,
  c.name,
  c.updated_at,
  c.portal_id,
  c.status,
  COALESCE(lm.last_msg, '{}'::jsonb) AS last_message,
  COALESCE(ap.parts, '[]'::jsonb) AS participants
FROM public.conversations c
LEFT JOIN last_msgs lm ON lm.conversation_id = c.id
LEFT JOIN agg_participants ap ON ap.conversation_id = c.id
WHERE c.id = _conversation_id;
$$;
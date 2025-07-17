-- Get user's accessible items with portal context
CREATE OR REPLACE FUNCTION get_user_items(
  folder_id UUID DEFAULT NULL,
  p_portal_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  type VARCHAR,
  parent_id UUID,
  owner_id UUID,
  portal_id UUID,
  file_path VARCHAR,
  file_size BIGINT,
  mime_type VARCHAR,
  starred BOOLEAN,
  is_public BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  can_edit BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fi.id,
    fi.name,
    fi.type,
    fi.parent_id,
    fi.owner_id,
    fi.portal_id,
    fi.file_path,
    fi.file_size,
    fi.mime_type,
    fi.starred,
    fi.is_public,
    fi.created_at,
    fi.updated_at,
    true as can_edit
  FROM public.file_items fi
  WHERE 
    fi.parent_id IS NOT DISTINCT FROM folder_id
    AND fi.portal_id = p_portal_id  -- Use the parameter with prefix
  ORDER BY fi.type DESC, fi.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';
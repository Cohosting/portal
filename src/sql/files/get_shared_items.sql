-- Function to get shared items for a client user by email and folder
CREATE FUNCTION get_shared_items(user_email VARCHAR(255), folder_id UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    type VARCHAR(10),
    parent_id UUID,
    owner_id UUID,
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    starred BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    is_public BOOLEAN,
    portal_id UUID,
    shared_by_email VARCHAR(255),
    shared_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        fi.id,
        fi.name,
        fi.type,
        fi.parent_id,
        fi.owner_id,
        fi.file_path,
        fi.file_size,
        fi.mime_type,
        fi.starred,
        fi.created_at,
        fi.updated_at,
        fi.is_public,
        fi.portal_id,
        owner_user.email as shared_by_email,
        fs.created_at as shared_at
    FROM public.file_items fi
    JOIN public.file_shares fs ON fs.item_id = fi.id
    LEFT JOIN auth.users owner_user ON owner_user.id = fi.owner_id
    WHERE 
        fs.shared_with_email = user_email
        AND (
            -- If no folder specified, get root level shared items
            (folder_id IS NULL AND fi.parent_id IS NULL)
            OR 
            -- If folder specified, get items in that folder
            (folder_id IS NOT NULL AND fi.parent_id = folder_id)
            OR
            -- Also include items that are in shared parent folders
            EXISTS (
                SELECT 1 FROM public.file_shares parent_fs 
                WHERE parent_fs.shared_with_email = user_email 
                AND parent_fs.item_id = fi.parent_id
            )
        )
    ORDER BY fi.type DESC, fi.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- Function to get all folders shared with a client user
CREATE OR REPLACE FUNCTION get_all_shared_folders(user_email VARCHAR(255))
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    parent_id UUID,
    owner_id UUID,
    portal_id UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE shared_folders AS (
        -- Get directly shared folders
        SELECT DISTINCT
            fi.id,
            fi.name,
            fi.parent_id,
            fi.owner_id,
            fi.portal_id,
            fi.created_at,
            fi.updated_at
        FROM public.file_items fi
        JOIN public.file_shares fs ON fs.item_id = fi.id
        WHERE 
            fi.type = 'folder'
            AND fs.shared_with_email = user_email
        
        UNION
        
        -- Get parent folders of shared items (so navigation works)
        SELECT DISTINCT
            parent_fi.id,
            parent_fi.name,
            parent_fi.parent_id,
            parent_fi.owner_id,
            parent_fi.portal_id,
            parent_fi.created_at,
            parent_fi.updated_at
        FROM public.file_items fi
        JOIN public.file_shares fs ON fs.item_id = fi.id
        JOIN public.file_items parent_fi ON parent_fi.id = fi.parent_id
        WHERE 
            fs.shared_with_email = user_email
            AND parent_fi.type = 'folder'
    )
    SELECT * FROM shared_folders
    ORDER BY name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_shared_items(VARCHAR(255), UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_shared_folders(VARCHAR(255)) TO authenticated;
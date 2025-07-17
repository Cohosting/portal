-- Drop and recreate the function to ensure search_path is properly set
DROP FUNCTION IF EXISTS get_user_with_nested_portals(UUID);

CREATE FUNCTION get_user_with_nested_portals(input_user_id UUID)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT 
        jsonb_build_object(
            'user', to_jsonb(u) - 'portals',
            'portals', COALESCE(
                (
                    SELECT jsonb_agg(jsonb_build_object(
                        'id', p.id,
                        'brand_settings', p.brand_settings
                    ))
                    FROM unnest(u.portals) AS portal_id
                    JOIN public.portals p ON p.id = portal_id
                ),
                '[]'::jsonb
            )
        )
    INTO result
    FROM public.users u
    WHERE u.id = input_user_id;

    RETURN result;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';
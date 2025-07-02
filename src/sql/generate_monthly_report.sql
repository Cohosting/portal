CREATE OR REPLACE FUNCTION public.generate_monthly_report(report_date date, input_portal_id uuid)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    WITH current_month_data AS (
        SELECT
            -- Count all clients for this portal
            COALESCE((SELECT COUNT(DISTINCT id) FROM clients WHERE portal_id = input_portal_id), 0) AS total_clients,
            -- Count all invoices for this portal (not just created this month)
            COALESCE((SELECT COUNT(id) FROM invoices WHERE portal_id = input_portal_id), 0) AS total_invoices,
            -- Total revenue from all paid invoices (not just this month)
            COALESCE((SELECT SUM(amount) FROM invoices WHERE portal_id = input_portal_id AND status = 'paid'), 0) AS total_revenue,
            -- Count all open invoices (not just created this month)
            COALESCE((SELECT COUNT(id) FROM invoices WHERE portal_id = input_portal_id AND status = 'open'), 0) AS open_invoices,
            -- Percentage of ALL invoices that are paid (not just this month)
            COALESCE(
                ROUND(
                    (SELECT COUNT(*) FROM invoices WHERE portal_id = input_portal_id AND status = 'paid')::numeric / 
                    NULLIF((SELECT COUNT(*) FROM invoices WHERE portal_id = input_portal_id), 0) * 100, 
                    2
                ), 
                0
            ) AS paid_invoices_percentage
        -- No FROM clause needed since we're using subqueries
    ),
    last_month_data AS (
        SELECT
            -- Count all clients as of end of last month
            COALESCE((SELECT COUNT(DISTINCT id) FROM clients WHERE portal_id = input_portal_id AND created_at < DATE_TRUNC('month', report_date)), 0) AS total_clients,
            -- Count all invoices as of end of last month
            COALESCE((SELECT COUNT(id) FROM invoices WHERE portal_id = input_portal_id AND created_at < DATE_TRUNC('month', report_date)), 0) AS total_invoices,
            -- Total revenue from paid invoices as of end of last month
            COALESCE((SELECT SUM(amount) FROM invoices WHERE portal_id = input_portal_id AND status = 'paid' AND created_at < DATE_TRUNC('month', report_date)), 0) AS total_revenue,
            -- Count open invoices as of end of last month
            COALESCE((SELECT COUNT(id) FROM invoices WHERE portal_id = input_portal_id AND status = 'open' AND created_at < DATE_TRUNC('month', report_date)), 0) AS open_invoices,
            -- Percentage of ALL paid invoices as of last month
            COALESCE(
                ROUND(
                    (SELECT COUNT(*) FROM invoices WHERE portal_id = input_portal_id AND status = 'paid' AND created_at < DATE_TRUNC('month', report_date))::numeric / 
                    NULLIF((SELECT COUNT(*) FROM invoices WHERE portal_id = input_portal_id AND created_at < DATE_TRUNC('month', report_date)), 0) * 100, 
                    2
                ), 
                0
            ) AS paid_invoices_percentage
        -- No FROM clause needed since we're using subqueries
    )
    SELECT json_build_object(
        'total_clients', json_build_object(
            'value', cmd.total_clients,
            'change', COALESCE(cmd.total_clients - lmd.total_clients, 0)
        ),
        'total_invoices', json_build_object(
            'value', cmd.total_invoices,
            'change', COALESCE(cmd.total_invoices - lmd.total_invoices, 0)
        ),
        'total_revenue', json_build_object(
            'value', cmd.total_revenue,
            -- Absolute dollar change (not percentage)
            'change', COALESCE(cmd.total_revenue - lmd.total_revenue, 0)
        ),
        'open_invoices', json_build_object(
            'value', cmd.open_invoices,
            'change', COALESCE(cmd.open_invoices - lmd.open_invoices, 0)
        ),
        'paid_invoices_percentage', json_build_object(
            'value', cmd.paid_invoices_percentage,
            'change', COALESCE(cmd.paid_invoices_percentage - lmd.paid_invoices_percentage, 0)
        )
    ) INTO result
    FROM current_month_data cmd, last_month_data lmd;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
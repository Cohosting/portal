CREATE FUNCTION get_invoice_counts(portal_id UUID, client_id UUID)
RETURNS TABLE(
  all_count int,
  open_count int,
  paid_count int,
  processing_count int
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::int AS all_count,
    COUNT(*) FILTER (WHERE status = 'open')::int AS open_count,
    COUNT(*) FILTER (WHERE status = 'paid')::int AS paid_count,
    COUNT(*) FILTER (WHERE status = 'processing')::int AS processing_count
  FROM public.invoices
  WHERE portal_id = get_invoice_counts.portal_id
  AND client_id = get_invoice_counts.client_id;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '';
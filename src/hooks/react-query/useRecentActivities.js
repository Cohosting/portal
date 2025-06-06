// useRecentActivities.js (or similar)
import { useQuery } from 'react-query'
import { supabase } from '../../lib/supabase'

export const getRecentActivities = async (portal_id, pageIndex, pageSize) => {
  // compute “from” and “to” using your pageIndex and pageSize:
  const from = pageIndex * pageSize
  const to = pageIndex * pageSize + (pageSize - 1)

  // console.log just to verify values before the query:
  console.log("Fetching page:", pageIndex, "size:", pageSize, "from/to:", from, to)

  const { data, error } = await supabase
    .from('recent_activities')
    .select('*')
    .eq('portal_id', portal_id)
    .order('created_at', { ascending: false })
    .range(from, to) // ← this replaces your old .limit(10)

  if (error) throw error
  return data
}

const useRecentActivities = (portal_id, pageIndex, pageSize) => {
  return useQuery({
    queryKey: ['recentActivities', portal_id, pageIndex],
    queryFn: () => getRecentActivities(portal_id, pageIndex, pageSize),
    enabled: !!portal_id,
    keepPreviousData: true,
  })
}

export default useRecentActivities

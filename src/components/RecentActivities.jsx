// imports at top of file
import { DateTime } from 'luxon'
import { useState } from 'react'
import useRecentActivities from '../hooks/react-query/useRecentActivities'
import { Clock } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { FileText } from 'lucide-react'

export default function RecentActivitiesList({ portal_id }) {
  console.log({
    portal_id
  })

  // 1. Track current pageIndex (0-based) and a fixed pageSize
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 5

  // 2. Fetch one “page” of activities
  const {
    data: recentActivities = [],
    isLoading,
    isError,
  } = useRecentActivities(portal_id, pageIndex, pageSize)

  console.log({
    recentActivities
  })

  // 3. Determine if there’s a next page:
  //    if fetched rows < pageSize, then we’re on the last page
  const hasMore = recentActivities.length === pageSize

  // 4. Handlers to go forward/back
  const goNext = () => {
    if (hasMore) {
      setPageIndex((prev) => prev + 1)
    }
  }
  const goPrev = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1)
    }
  }

  if (isLoading) {
    return <div>Loading…</div>
  }
  if (isError) {
    return <div>Error loading recent activities.</div>
  }

  return (
    <>
      <div className='h-[360px]'>
        {/* Render current page of activities */}
        {
          recentActivities.length > 0 ? recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="p-2 bg-indigo-50 rounded-full">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Draft
                  </span>
                </div>

                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-gray-400" />
                  <span>
                    {DateTime.fromISO(activity.created_at).toRelative()}
                  </span>
                </div>
              </div>

              <button className="ml-4 p-1.5 rounded-full hover:bg-gray-200 transition-colors">
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        )) : (
          <div className="p-4 text-center">
          <p className='font-medium text-gray-500 mt-4'>No recent activities found.</p>
          </div>
        )}
      </div>

      {/* Pagination controls (slightly adjusted classes only) */}
      <div className="mt-4 px-4 py-3 flex items-center space-x-2 justify-end border-1 border-gray-200">
        {/* “Previous” is disabled when on first page */}
        <button
          onClick={goPrev}
          disabled={pageIndex === 0}
          className={`px-4 py-2 text-sm rounded-l-md ${
            pageIndex === 0
              ? 'bg-gray-100 border border-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
              : 'bg-indigo-600 border border-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          Previous
        </button>

        {/* Show current page number (1-based) */}
        <span className="px-4 py-2 text-sm font-medium text-gray-700">
          Page {pageIndex + 1}
        </span>

        {/* “Next” is disabled if there’s no more data */}
        <button
          onClick={goNext}
          disabled={!hasMore}
          className={`px-4 py-2 text-sm rounded-r-md ${
            !hasMore
              ? 'bg-gray-100 border border-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
              : 'bg-indigo-600 border border-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          Next
        </button>


      </div>
    </>
  )
}

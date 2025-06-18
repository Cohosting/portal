import { DateTime } from 'luxon'
import { useState } from 'react'
import useRecentActivities from '../hooks/react-query/useRecentActivities'
import { Clock, ChevronLeft, ChevronRight, FileText, Loader } from 'lucide-react'

// --- StatusBadge helper to keep badge styles consistent ---
const statusStyles = {
  draft:     'bg-amber-500 text-white',
  open:      'bg-amber-500 text-white',
  finalized: 'bg-blue-500 text-white',
  paid:      'bg-green-500 text-white',
  default:   'bg-gray-200 text-gray-700',
}

function StatusBadge({ status }) {
  const key = status?.toLowerCase()
  const classes = statusStyles[key] || statusStyles.default

  return (
    <span
      className={
        `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ` +
        classes
      }
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  )
}

// --- Invoice title renderer using only Tailwind utilities ---
export const getInvoiceTitle = ({ client, invoice }) => {
  const name = client?.name || 'Unknown Client'
  const deleted = Boolean(client?.is_deleted)

  return (
    <p className="text-sm font-medium text-gray-900 flex items-center space-x-2 truncate">
      <span>Invoice</span>
      <StatusBadge status={invoice?.additional_data?.status || 'unknown'} />
      <span className="text-gray-700">for</span>
      {deleted
        ? <span className="italic text-gray-500">{name} – (Deleted)</span>
        : <span className="font-semibold">{name}</span>
      }
    </p>
  )
}

// --- Main component ---
export default function RecentActivitiesList({ portal_id }) {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 5

  const {
    data: recentActivities = [],
    isLoading,
    isError,
    isFetching,
  } = useRecentActivities(portal_id, pageIndex, pageSize)

  const hasMore = recentActivities.length === pageSize

  const goPrev = () => {
    if (pageIndex > 0 && !isFetching) setPageIndex(i => i - 1)
  }
  const goNext = () => {
    if (hasMore && !isFetching) setPageIndex(i => i + 1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <Loader className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading recent activities.
      </div>
    )
  }

  return (
    <>
      {/* Activities list / empty state container */}
      <div className="overflow-y-auto h-[400px]">
        {recentActivities.length > 0 ? (
          <div className="space-y-2">
            {recentActivities.map(activity => (
              <div
                key={activity.id}
                className="flex items-start p-4 hover:bg-gray-50 transition-colors rounded"
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    {getInvoiceTitle(activity)}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                    <span>
                      {DateTime.fromISO(activity.created_at).toRelative()}
                    </span>
                  </div>
                </div>

                <button className="ml-4 p-1.5 rounded-full hover:bg-blue-50 transition-colors">
                  <ChevronRight className="h-4 w-4 text-blue-600" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <FileText className="h-12 w-12 mb-3 text-gray-400" />
            <p className="text-sm font-medium">No recent activities</p>
          </div>
        )}
      </div>

      {/* Render pagination only if there are more pages or previous pages */}
      {recentActivities.length > 0 && (pageIndex > 0 || hasMore) && (
        <div className="mt-4 px-4 py-3 flex items-center justify-end space-x-6 text-gray-600">
          <button
            onClick={goPrev}
            disabled={pageIndex === 0 || isFetching}
            className={`flex items-center space-x-1 text-sm font-medium ${
              pageIndex === 0 || isFetching
                ? 'text-gray-300 cursor-not-allowed'
                : 'hover:text-gray-800'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span className="text-sm text-gray-700">
            Page {pageIndex + 1}
          </span>

          <button
            onClick={goNext}
            disabled={!hasMore || isFetching}
            className={`flex items-center space-x-1 text-sm font-medium ${
              !hasMore || isFetching
                ? 'text-gray-300 cursor-not-allowed'
                : 'hover:text-gray-800'
            }`}
          >
            <span>Next</span>
            {isFetching ? (
              <Loader className="h-4 w-4 animate-spin text-gray-600" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </>
  )
}

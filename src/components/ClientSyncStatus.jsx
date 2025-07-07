import React, { useEffect, useState, useRef } from 'react'
import { CheckCircle, XCircle, Loader2, CreditCard, Users } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/button'

// Badge styles
const badgeStyles = {
  success: 'bg-green-50 text-green-700',
  error: 'bg-red-50 text-red-700',
}

const SyncStatusContent = ({
  syncStats,
  syncStatus,
  syncError,
  // progress,
  onDismiss,
  isDismissing,
}) => {
  const { synced = 0, failed = 0, created = 0, totalClients = 0 } =
    syncStats || {}
  const processed = synced + created + failed
  const progress = processed / totalClients * 100

  return (
    <div className="w-full space-y-3">
      {syncStatus === 'syncing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Syncing with Stripe...</span>
            <span className="text-gray-500 font-mono text-xs">
              {processed}/{totalClients}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {created > 0 && (
              <div className="flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>+{created} new</span>
              </div>
            )}
            {synced > 0 && (
              <div className="flex items-center gap-1 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{synced} updated</span>
              </div>
            )}
            {failed > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{failed} failed</span>
              </div>
            )}
          </div>
        </div>
      )}

      {syncStatus === 'completed' && (
        <div className="space-y-2">
          <div className="text-sm text-gray-700">
            Successfully synced {totalClients} clients with Stripe
          </div>
          <div className="flex items-center gap-3 text-xs flex-wrap">
            {created > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-200">
                <Users className="w-3 h-3" />
                <span>+{created} created</span>
              </div>
            )}
            {synced > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-200">
                <CreditCard className="w-3 h-3" />
                <span>{synced} synced</span>
              </div>
            )}
            {failed > 0 && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md ${badgeStyles.error}`}
              >
                <XCircle className="w-3 h-3" />
                <span>{failed} failed</span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">Client data is now up to date</div>
        </div>
      )}

      {syncStatus === 'failed' && (
        <div className="space-y-2">
          <div className="text-sm text-gray-700">
            Sync with Stripe was interrupted
          </div>
          <div className="flex items-center gap-3 text-xs flex-wrap">
            {synced > 0 && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md ${badgeStyles.success}`}
              >
                <CheckCircle className="w-3 h-3" />
                <span>{synced} completed</span>
              </div>
            )}
            {created > 0 && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md ${badgeStyles.success}`}
              >
                <Users className="w-3 h-3" />
                <span>+{created} created</span>
              </div>
            )}
            {failed > 0 && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md ${badgeStyles.error}`}
              >
                <XCircle className="w-3 h-3" />
                <span>{failed} failed</span>
              </div>
            )}
          </div>
        </div>
      )}

      {syncError && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
          <strong>Error:</strong> {syncError}
        </div>
      )}

      {(syncStatus === 'completed' || syncStatus === 'failed') && onDismiss && (
        <div className="flex justify-end pt-2">
          <Button
            onClick={onDismiss}
            disabled={isDismissing}
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors bg-black text-white"
          >
            {isDismissing ? (
              <div className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Dismissing...</span>
              </div>
            ) : (
              'Dismiss'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

const ClientSyncStatus = ({
  syncStats,
  syncStatus = 'completed',
  syncError = null,
  syncStartedAt = null,
  syncCompletedAt = null,
  syncNotificationDismissedAt = null,
  portalId,
}) => {
  const [isDismissing, setIsDismissing] = useState(false)
  const debounceRef = useRef(null)
  const lastSyncDataRef = useRef(null)

  const shouldShowToast = () => {
    const syncTimestamp = syncCompletedAt || syncStartedAt
    if (!syncTimestamp) return true
    if (!syncNotificationDismissedAt) return true
    return new Date(syncTimestamp) > new Date(syncNotificationDismissedAt)
  }

  const handleDismissSync = async (portalId, toastId) => {
    setIsDismissing(true)
    try {
      const { error } = await supabase
        .from('portals')
        .update({ sync_notification_dismissed_at: new Date() })
        .eq('id', portalId)

      if (error) {
        toast.error('Failed to dismiss sync notification')
      } else {
        toast.dismiss(toastId)
        toast.success('Sync notification dismissed')
      }
    } catch {
      toast.error('Failed to dismiss sync notification')
    } finally {
      setIsDismissing(false)
    }
  }

  const showSyncToast = ({ syncStatus, syncStats, syncError, progress }) => {
    return toast.custom(
      (t) => {
        const icon =
          syncStatus === 'syncing' ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500 mt-0.5" />
          ) : syncStatus === 'completed' ? (
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
          ) : syncStatus === 'failed' ? (
            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
          ) : null

        const onDismiss =
          syncStatus === 'completed' || syncStatus === 'failed'
            ? () => handleDismissSync(portalId, t.id)
            : null

        return (
          <div className="flex items-start gap-3 p-3 bg-white border rounded shadow-md w-full max-w-md">
            {icon}
            <div className="flex-1">
              <SyncStatusContent
                syncStats={syncStats}
                syncStatus={syncStatus}
                syncError={syncError}
                progress={progress}
                onDismiss={onDismiss}
                isDismissing={isDismissing}
              />
            </div>
          </div>
        )
      },
      {
        duration: Infinity,
        dismissible: true,
      }
    )
  }

  useEffect(() => {
    const currentSyncData = {
      syncStatus,
      synced: syncStats?.synced,
      failed: syncStats?.failed,
      created: syncStats?.created,
      totalClients: syncStats?.totalClients,
      progress: syncStats?.progress,
      syncError,
      syncStartedAt,
      syncCompletedAt,
      syncNotificationDismissedAt,
    }

    if (!shouldShowToast() || !syncStatus || syncStatus === 'idle') return

    const dataChanged =
      !lastSyncDataRef.current ||
      JSON.stringify(currentSyncData) !==
        JSON.stringify(lastSyncDataRef.current)
    if (!dataChanged) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    const delay = syncStatus === 'syncing' ? 0 : 500

    debounceRef.current = setTimeout(() => {
      toast.dismiss()
      showSyncToast({
        syncStatus,
        syncStats,
        syncError,
        progress: syncStats?.progress,
      })
      lastSyncDataRef.current = currentSyncData
    }, delay)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [
    syncStatus,
    syncStats?.synced,
    syncStats?.failed,
    syncStats?.created,
    syncStats?.totalClients,
    syncStats?.progress,
    syncError,
    syncStartedAt,
    syncCompletedAt,
    syncNotificationDismissedAt,
    portalId,
  ])

  return null
}

export default ClientSyncStatus

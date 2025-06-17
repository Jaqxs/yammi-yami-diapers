"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Wifi, WifiOff, RefreshCw, Clock, CheckCircle, X } from "lucide-react"
import { useStoreSync } from "@/lib/store-sync"

interface AdminChangeNotificationProps {
  className?: string
  showDetails?: boolean
}

export function AdminChangeNotification({ className = "", showDetails = true }: AdminChangeNotificationProps) {
  const { toast } = useToast()
  const { syncStatus, triggerSync, isOnline, pendingChanges, lastSync } = useStoreSync()
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Show notification when there are pending changes or offline
  useEffect(() => {
    setIsVisible(!isOnline || pendingChanges > 0)
  }, [isOnline, pendingChanges])

  // Auto-hide after successful sync
  useEffect(() => {
    if (isOnline && pendingChanges === 0 && lastSync) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, pendingChanges, lastSync])

  if (!isVisible) return null

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4" />
    if (pendingChanges > 0) return <Clock className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  const getStatusMessage = () => {
    if (!isOnline && pendingChanges > 0) {
      return `Offline - ${pendingChanges} changes pending sync`
    }
    if (!isOnline) {
      return "Working offline - changes will sync when reconnected"
    }
    if (pendingChanges > 0) {
      return `${pendingChanges} changes waiting to sync`
    }
    if (lastSync) {
      return `Last synced: ${lastSync.toLocaleTimeString()}`
    }
    return "All changes synced"
  }

  const getAlertVariant = () => {
    if (!isOnline) return "destructive"
    if (pendingChanges > 0) return "default"
    return "default"
  }

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button onClick={() => setIsMinimized(false)} variant="outline" size="sm" className="shadow-lg">
          {getStatusIcon()}
          {pendingChanges > 0 && (
            <Badge variant="secondary" className="ml-2">
              {pendingChanges}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-md ${className}`}>
      <Alert variant={getAlertVariant()} className="shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <div className="flex-1">
              <AlertDescription className="text-sm">{getStatusMessage()}</AlertDescription>

              {showDetails && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {isOnline ? (
                      <>
                        <Wifi className="h-3 w-3" />
                        Online
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3 w-3" />
                        Offline
                      </>
                    )}
                  </div>

                  {pendingChanges > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {pendingChanges} pending
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isOnline && pendingChanges > 0 && (
              <Button onClick={triggerSync} variant="ghost" size="sm" className="h-6 w-6 p-0">
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}

            <Button onClick={() => setIsMinimized(true)} variant="ghost" size="sm" className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {!isOnline && (
          <div className="mt-2 text-xs text-muted-foreground">
            Changes are being saved locally and will sync automatically when connection is restored.
          </div>
        )}
      </Alert>
    </div>
  )
}

// Export additional notification components
export function AdminSyncStatus() {
  const { isOnline, pendingChanges, lastSync } = useStoreSync()

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}

      <span>{isOnline ? "Online" : "Offline"}</span>

      {pendingChanges > 0 && (
        <Badge variant="outline" className="text-xs">
          {pendingChanges} pending
        </Badge>
      )}

      {lastSync && <span className="text-xs">Last sync: {lastSync.toLocaleTimeString()}</span>}
    </div>
  )
}

export function AdminSyncButton() {
  const { triggerSync, isOnline, pendingChanges } = useStoreSync()
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await triggerSync()
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Button onClick={handleSync} disabled={!isOnline || pendingChanges === 0 || isSyncing} variant="outline" size="sm">
      <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
      {isSyncing ? "Syncing..." : "Sync Now"}
      {pendingChanges > 0 && (
        <Badge variant="secondary" className="ml-2">
          {pendingChanges}
        </Badge>
      )}
    </Button>
  )
}

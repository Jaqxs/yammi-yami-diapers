"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useRealtime } from "@/lib/realtime-store"
import { Activity, Wifi, WifiOff } from "lucide-react"

export function RealtimeStatus() {
  const { lastUpdated, isLoading } = useRealtime()
  const [isOnline, setIsOnline] = useState(true)
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>("")

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!lastUpdated) return

    const updateTimer = () => {
      const now = new Date()
      const diff = now.getTime() - lastUpdated.getTime()
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)

      if (minutes > 0) {
        setTimeSinceUpdate(`${minutes}m ago`)
      } else {
        setTimeSinceUpdate(`${seconds}s ago`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  if (isLoading) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Activity className="h-3 w-3 animate-pulse" />
        Loading...
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isOnline ? "Online" : "Offline"}
      </Badge>

      {lastUpdated && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-green-500" />
          {timeSinceUpdate}
        </Badge>
      )}
    </div>
  )
}

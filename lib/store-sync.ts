"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface StoreSync {
  lastSync: Date | null
  isOnline: boolean
  pendingChanges: number
}

export function useStoreSync() {
  const { toast } = useToast()
  const [syncStatus, setSyncStatus] = useState<StoreSync>({
    lastSync: null,
    isOnline: true,
    pendingChanges: 0,
  })

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: true }))
      toast({
        title: "Back Online",
        description: "Connection restored. Syncing changes...",
        variant: "default",
      })
      syncPendingChanges()
    }

    const handleOffline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: false }))
      toast({
        title: "Connection Lost",
        description: "Working offline. Changes will sync when reconnected.",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Set initial online status
    setSyncStatus((prev) => ({ ...prev, isOnline: navigator.onLine }))

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  // Sync pending changes when coming back online
  const syncPendingChanges = async () => {
    try {
      // Get pending changes from localStorage
      const pendingChanges = JSON.parse(localStorage.getItem("pendingStoreChanges") || "[]")

      if (pendingChanges.length === 0) return

      // Process each pending change
      for (const change of pendingChanges) {
        await processStoreChange(change)
      }

      // Clear pending changes
      localStorage.removeItem("pendingStoreChanges")
      setSyncStatus((prev) => ({
        ...prev,
        pendingChanges: 0,
        lastSync: new Date(),
      }))

      toast({
        title: "Sync Complete",
        description: `Synced ${pendingChanges.length} pending changes`,
        variant: "default",
      })
    } catch (error) {
      console.error("Failed to sync pending changes:", error)
      toast({
        title: "Sync Failed",
        description: "Some changes could not be synced. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Process individual store change
  const processStoreChange = async (change: any) => {
    const { type, data, timestamp } = change

    switch (type) {
      case "PRODUCT_UPDATE":
        await fetch(`/api/admin/products/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        break
      case "PRODUCT_CREATE":
        await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        break
      case "PRODUCT_DELETE":
        await fetch(`/api/admin/products/${data.id}`, {
          method: "DELETE",
        })
        break
      default:
        console.warn("Unknown change type:", type)
    }
  }

  // Add change to pending queue when offline
  const queueChange = (type: string, data: any) => {
    if (syncStatus.isOnline) {
      // Process immediately if online
      processStoreChange({ type, data, timestamp: new Date() })
      setSyncStatus((prev) => ({ ...prev, lastSync: new Date() }))
    } else {
      // Queue for later if offline
      const pendingChanges = JSON.parse(localStorage.getItem("pendingStoreChanges") || "[]")
      const newChange = { type, data, timestamp: new Date() }

      pendingChanges.push(newChange)
      localStorage.setItem("pendingStoreChanges", JSON.stringify(pendingChanges))

      setSyncStatus((prev) => ({
        ...prev,
        pendingChanges: pendingChanges.length,
      }))
    }
  }

  // Manual sync trigger
  const triggerSync = async () => {
    if (!syncStatus.isOnline) {
      toast({
        title: "Offline",
        description: "Cannot sync while offline",
        variant: "destructive",
      })
      return
    }

    await syncPendingChanges()
  }

  return {
    syncStatus,
    queueChange,
    triggerSync,
    isOnline: syncStatus.isOnline,
    pendingChanges: syncStatus.pendingChanges,
    lastSync: syncStatus.lastSync,
  }
}

// Export additional utilities
export const getStoreSyncStatus = () => {
  const pendingChanges = JSON.parse(localStorage.getItem("pendingStoreChanges") || "[]")
  return {
    hasPendingChanges: pendingChanges.length > 0,
    pendingCount: pendingChanges.length,
    isOnline: navigator.onLine,
  }
}

export const clearPendingChanges = () => {
  localStorage.removeItem("pendingStoreChanges")
}

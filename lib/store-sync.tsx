"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useStore } from "@/lib/store"

// Define the type for our sync events
type SyncEvent = {
  type: "product" | "blogPost" | "order"
  action: "add" | "update" | "delete"
  id: number | string
  timestamp: number
}

// Create a context for sync events
const StoreSyncContext = createContext<{
  lastEvent: SyncEvent | null
  notifyChange: (event: Omit<SyncEvent, "timestamp">) => void
}>({
  lastEvent: null,
  notifyChange: () => {},
})

// Provider component
export function StoreSyncProvider({ children }: { children: React.ReactNode }) {
  const [lastEvent, setLastEvent] = useState<SyncEvent | null>(null)
  const { refreshData } = useStore()

  // Function to notify about changes
  const notifyChange = (event: Omit<SyncEvent, "timestamp">) => {
    const fullEvent = { ...event, timestamp: Date.now() }
    setLastEvent(fullEvent)

    // Store the event in localStorage to sync across tabs/windows
    localStorage.setItem("yammy-last-sync-event", JSON.stringify(fullEvent))

    // Also refresh data in the current tab immediately
    refreshData()
  }

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "yammy-last-sync-event" && e.newValue) {
        try {
          const event = JSON.parse(e.newValue) as SyncEvent
          setLastEvent(event)
          refreshData() // Refresh data when changes are detected from other tabs
        } catch (error) {
          console.error("Failed to parse sync event:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [refreshData])

  return <StoreSyncContext.Provider value={{ lastEvent, notifyChange }}>{children}</StoreSyncContext.Provider>
}

// Custom hook to use the sync context
export const useStoreSync = () => {
  const context = useContext(StoreSyncContext)
  if (context === undefined) {
    throw new Error("useStoreSync must be used within a StoreSyncProvider")
  }
  return context
}

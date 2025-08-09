"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type StoreSyncContextType = {
  lastEvent: { type: string; action: string; id: number } | null
  notifyChange: (payload: { type: string; action: string; id: number }) => void
}

const StoreSyncContext = createContext<StoreSyncContextType | undefined>(undefined)

export function useStoreSync() {
  const context = useContext(StoreSyncContext)
  if (!context) {
    throw new Error("useStoreSync must be used within a StoreSyncProvider")
  }
  return context
}

export function StoreSyncProvider({ children }: { children: React.ReactNode }) {
  const [lastEvent, setLastEvent] = useState<{ type: string; action: string; id: number } | null>(null)

  const notifyChange = (payload: { type: string; action: string; id: number }) => {
    setLastEvent(payload)
  }

  return <StoreSyncContext.Provider value={{ lastEvent, notifyChange }}>{children}</StoreSyncContext.Provider>
}

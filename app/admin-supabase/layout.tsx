"use client"

import type React from "react"

import { RealtimeNotifications } from "@/components/realtime-notifications"

export default function AdminSupabaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <RealtimeNotifications />
      {children}
    </div>
  )
}

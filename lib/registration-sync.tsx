"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { useRegistrationStore } from "@/lib/registration-store"

export function RegistrationSync() {
  const { state, loadRegistrations } = useStore()
  const { email, status, updateStatus } = useRegistrationStore()

  // Load registrations when component mounts
  useEffect(() => {
    loadRegistrations()
  }, [loadRegistrations])

  // Check for registration status changes in the main store
  useEffect(() => {
    if (email) {
      const userRegistration = state.registrations.find((reg) => reg.email === email)

      if (userRegistration && userRegistration.status !== status) {
        // Update the registration store with the latest status
        updateStatus(email, userRegistration.status)
      }
    }
  }, [email, state.registrations, status, updateStatus])

  // Listen for localStorage events for registration status changes
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "registration-status-change" && event.newValue) {
        try {
          const data = JSON.parse(event.newValue)
          if (data.email === email) {
            updateStatus(email, data.status)
          }
        } catch (error) {
          console.error("Failed to parse registration status change:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageEvent)
    return () => {
      window.removeEventListener("storage", handleStorageEvent)
    }
  }, [email, updateStatus])

  return null
}

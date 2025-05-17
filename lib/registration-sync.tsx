"use client"

import { useEffect, useRef } from "react"
import { useStore } from "@/lib/store"
import { useRegistrationStore } from "@/lib/registration-store"

export function RegistrationSync() {
  const store = useStore()
  const { email, status, updateStatus } = useRegistrationStore()
  const initialLoadCompleted = useRef(false)

  // Load registrations only once when component mounts
  useEffect(() => {
    if (!initialLoadCompleted.current) {
      const loadData = async () => {
        try {
          await store.loadRegistrations()
          initialLoadCompleted.current = true

          // Check if there are any new registrations in localStorage that need to be synced
          const syncRegistrations = () => {
            const storedRegistrations = localStorage.getItem("yammy-registrations")
            if (storedRegistrations) {
              const registrations = JSON.parse(storedRegistrations)

              // Update the store with these registrations if needed
              if (registrations.length > store.state.registrations.length) {
                store.refreshData()
              }
            }
          }

          syncRegistrations()
        } catch (error) {
          console.error("Error loading registrations:", error)
        }
      }

      loadData()
    }

    // Listen for registration added events
    const handleRegistrationAdded = () => {
      store.refreshData()
    }

    window.addEventListener("registrationAdded", handleRegistrationAdded)

    return () => {
      window.removeEventListener("registrationAdded", handleRegistrationAdded)
    }
  }, [store])

  // Check for registration status changes in the main store
  useEffect(() => {
    if (email && store.state.registrations) {
      const userRegistration = store.state.registrations.find((reg) => reg.email === email)

      if (userRegistration && userRegistration.status !== status) {
        // Update the registration store with the latest status
        updateStatus(email, userRegistration.status)
      }
    }
  }, [email, store.state.registrations, status, updateStatus])

  // Listen for localStorage events for registration status changes
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "registration-status-change" && event.newValue) {
        try {
          const data = JSON.parse(event.newValue)
          if (data.email === email) {
            updateStatus(email, data.status)
          }

          // Also refresh the main store data
          store.refreshData()
        } catch (error) {
          console.error("Failed to parse registration status change:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageEvent)
    return () => {
      window.removeEventListener("storage", handleStorageEvent)
    }
  }, [email, updateStatus, store])

  return null
}

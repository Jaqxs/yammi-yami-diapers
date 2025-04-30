"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { useRegistrationStore } from "@/lib/registration-store"

export function RegistrationSync() {
  const { state, loadRegistrations } = useStore()
  const { email, setRegistrationInfo, reset } = useRegistrationStore()

  useEffect(() => {
    // Load registrations when component mounts
    loadRegistrations()
  }, [loadRegistrations])

  useEffect(() => {
    // If user is logged in (has email), check their status in the main store
    if (email) {
      const userRegistration = state.registrations.find((reg) => reg.email === email)

      if (userRegistration) {
        // Update the registration store with the latest status from the main store
        setRegistrationInfo({
          name: userRegistration.name,
          email: userRegistration.email,
          phone: userRegistration.phone,
          region: userRegistration.region || "Unknown",
          paymentConfirmation: userRegistration.paymentReference,
        })
      }
    }
  }, [email, state.registrations, setRegistrationInfo])

  return null
}

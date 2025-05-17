"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RegistrationInfo {
  name: string
  email: string
  phone: string
  region: string
  location?: string
  paymentConfirmation?: string
  status?: "pending" | "approved" | "rejected"
}

interface RegistrationState {
  info: RegistrationInfo | null
  status: "none" | "pending" | "approved" | "rejected"
  email: string | null
  setRegistrationInfo: (info: RegistrationInfo) => void
  setRegistrationStatus: (status: "none" | "pending" | "approved" | "rejected") => void
  checkRegistrationStatus: (email: string) => "none" | "pending" | "approved" | "rejected"
  clearRegistration: () => void
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      info: null,
      status: "none",
      email: null,
      setRegistrationInfo: (info) => {
        set({
          info,
          email: info.email,
          status: info.status || "approved", // Default to approved
        })

        // Also update in localStorage for persistence
        try {
          const registrationsJSON = localStorage.getItem("yammy-registrations") || "[]"
          const registrations = JSON.parse(registrationsJSON)

          // Check if this email already exists
          const existingIndex = registrations.findIndex((r: any) => r.email === info.email)

          if (existingIndex >= 0) {
            // Update existing registration
            registrations[existingIndex] = {
              ...registrations[existingIndex],
              ...info,
              status: info.status || "approved",
              lastUpdated: new Date().toISOString(),
            }
          } else {
            // Add new registration
            registrations.push({
              id: registrations.length > 0 ? Math.max(...registrations.map((r: any) => r.id)) + 1 : 1,
              ...info,
              status: info.status || "approved",
              date: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
            })
          }

          localStorage.setItem("yammy-registrations", JSON.stringify(registrations))

          // Dispatch event for other components
          window.dispatchEvent(new Event("registrationUpdated"))
        } catch (error) {
          console.error("Error updating registration in localStorage:", error)
        }
      },
      setRegistrationStatus: (status) => {
        set((state) => ({
          ...state,
          status,
        }))
      },
      checkRegistrationStatus: (email) => {
        // First check if this is the current user
        if (get().email === email) {
          return get().status
        }

        // Check in localStorage for this email
        try {
          const registrationsJSON = localStorage.getItem("yammy-registrations")
          if (registrationsJSON) {
            const registrations = JSON.parse(registrationsJSON)
            const registration = registrations.find((r: any) => r.email === email)
            if (registration) {
              return registration.status
            }
          }
        } catch (error) {
          console.error("Error checking registration status:", error)
        }

        return "none"
      },
      clearRegistration: () => {
        set({
          info: null,
          status: "none",
          email: null,
        })
      },
    }),
    {
      name: "yammy-registration",
    },
  ),
)

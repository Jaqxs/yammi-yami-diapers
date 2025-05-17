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
          status: info.status || "pending",
        })
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

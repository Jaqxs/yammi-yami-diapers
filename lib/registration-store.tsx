"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockRegistrations } from "@/data/mock-registrations"

export type RegistrationStatus = "unregistered" | "pending" | "approved" | "rejected"

export interface RegistrationState {
  status: RegistrationStatus
  email: string | null
  name: string | null
  phone: string | null
  region: string | null
  registrationDate: Date | null
  paymentConfirmation: string | null
  setRegistrationInfo: (info: {
    name: string
    email: string
    phone: string
    region: string
    paymentConfirmation: string
  }) => void
  updateStatus: (email: string, status: RegistrationStatus) => void
  checkRegistrationStatus: (email: string) => RegistrationStatus
  reset: () => void
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      status: "unregistered",
      email: null,
      name: null,
      phone: null,
      region: null,
      registrationDate: null,
      paymentConfirmation: null,

      setRegistrationInfo: (info) => {
        // Check if there's an existing registration with this email in localStorage
        const storedRegistrations = localStorage.getItem("yammy-registrations")
        let currentStatus = "pending" as RegistrationStatus

        if (storedRegistrations) {
          const registrations = JSON.parse(storedRegistrations)
          const existingRegistration = registrations.find((reg: any) => reg.email === info.email)

          if (existingRegistration) {
            currentStatus = existingRegistration.status as RegistrationStatus
          }
        }

        set({
          name: info.name,
          email: info.email,
          phone: info.phone,
          region: info.region,
          paymentConfirmation: info.paymentConfirmation,
          registrationDate: new Date(),
          status: currentStatus,
        })
      },

      updateStatus: (email, status) => {
        if (get().email === email) {
          set({ status })
        }
      },

      checkRegistrationStatus: (email) => {
        // First check localStorage for registrations
        const storedRegistrations = localStorage.getItem("yammy-registrations")
        if (storedRegistrations) {
          const registrations = JSON.parse(storedRegistrations)
          const existingRegistration = registrations.find((reg: any) => reg.email === email)

          if (existingRegistration) {
            // If this is the current user, update their status
            if (get().email === email && get().status !== existingRegistration.status) {
              set({ status: existingRegistration.status as RegistrationStatus })
            }
            return existingRegistration.status as RegistrationStatus
          }
        }

        // Then check mock registrations
        const existingMockRegistration = mockRegistrations.find((reg) => reg.email === email)
        if (existingMockRegistration) {
          return existingMockRegistration.status as RegistrationStatus
        }

        // Finally check the current state
        return get().email === email ? get().status : "unregistered"
      },

      reset: () => {
        set({
          status: "unregistered",
          email: null,
          name: null,
          phone: null,
          region: null,
          registrationDate: null,
          paymentConfirmation: null,
        })
      },
    }),
    {
      name: "registration-storage",
    },
  ),
)

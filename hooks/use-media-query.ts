"use client"

import { useState, useEffect } from "react"

// Custom hook for checking specific breakpoints
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)

      // Initial check
      setMatches(media.matches)

      // Add event listener
      const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
      media.addEventListener("change", listener)

      // Clean up
      return () => media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
}

// Custom hook for checking if the screen is mobile
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 640)
      }

      // Initial check
      checkIfMobile()

      // Add event listener
      window.addEventListener("resize", checkIfMobile)

      // Clean up
      return () => window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return isMobile
}

// Custom hook for checking if the screen is tablet
export function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      const checkIfTablet = () => {
        setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024)
      }

      // Initial check
      checkIfTablet()

      // Add event listener
      window.addEventListener("resize", checkIfTablet)

      // Clean up
      return () => window.removeEventListener("resize", checkIfTablet)
    }
  }, [])

  return isTablet
}

// Custom hook for checking if the screen is desktop
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      const checkIfDesktop = () => {
        setIsDesktop(window.innerWidth >= 1024)
      }

      // Initial check
      checkIfDesktop()

      // Add event listener
      window.addEventListener("resize", checkIfDesktop)

      // Clean up
      return () => window.removeEventListener("resize", checkIfDesktop)
    }
  }, [])

  return isDesktop
}

export const useIsTouchDevice = () => useMediaQuery("(hover: none) and (pointer: coarse)")

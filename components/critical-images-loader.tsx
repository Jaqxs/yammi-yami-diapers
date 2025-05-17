"use client"

import { useEffect } from "react"
import { preloadImages } from "@/lib/image-preloader"

// List of critical images that should be preloaded
const CRITICAL_IMAGES = [
  "/images/baby-diapers.png",
  "/images/diaper-features.png",
  "/images/lady-pads.png",
  "/assorted-products-display.png",
]

export function CriticalImagesLoader() {
  useEffect(() => {
    // Use requestIdleCallback to preload images when the browser is idle
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        preloadImages(CRITICAL_IMAGES, {
          concurrency: 2,
        })
      })
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => {
        preloadImages(CRITICAL_IMAGES, {
          concurrency: 2,
        })
      }, 1000)
    }
  }, [])

  // This component doesn't render anything
  return null
}

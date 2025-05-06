"use client"

import { useEffect } from "react"
import { forceReloadImages, prefetchImage } from "@/utils/cache-buster"
import { usePathname } from "next/navigation"

/**
 * Hook to ensure images are refreshed when navigating between pages
 * @param imageUrls Optional array of image URLs to prefetch
 */
export function useImageRefresh(imageUrls: string[] = []) {
  const pathname = usePathname()

  useEffect(() => {
    // Force reload all images with the force-reload class
    forceReloadImages()

    // Clear any cached image data in the browser
    if ("caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName.includes("image") || cacheName.includes("yammy-yami")) {
            // Clear specific caches that might contain images
            caches.delete(cacheName)
          }
        })
      })
    }

    // Prefetch any specific images that need to be loaded
    imageUrls.forEach((url) => {
      prefetchImage(url)
    })

    // Send message to service worker to clear image cache
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CLEAR_IMAGE_CACHE",
      })
    }
  }, [pathname, imageUrls])
}

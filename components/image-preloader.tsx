"use client"

import { useEffect, useState } from "react"
import { addTimestampToUrl } from "@/lib/image-utils"

interface ImagePreloaderProps {
  images: string[]
  onProgress?: (progress: number) => void
  onComplete?: () => void
}

/**
 * Component to preload images in the background
 */
export function ImagePreloader({ images, onProgress, onComplete }: ImagePreloaderProps) {
  const [loaded, setLoaded] = useState(0)
  const total = images.length

  useEffect(() => {
    if (!images || images.length === 0) {
      onComplete?.()
      return
    }

    let mounted = true
    let loadedCount = 0

    // Add timestamp to prevent caching
    const timestamp = Date.now()

    images.forEach((src) => {
      if (!src) {
        // Skip empty URLs
        loadedCount++
        if (mounted) {
          setLoaded(loadedCount)
          onProgress?.(loadedCount / total)
          if (loadedCount === total) onComplete?.()
        }
        return
      }

      const img = new Image()

      img.onload = () => {
        loadedCount++
        if (mounted) {
          setLoaded(loadedCount)
          onProgress?.(loadedCount / total)
          if (loadedCount === total) onComplete?.()
        }
      }

      img.onerror = () => {
        console.error(`Failed to preload image: ${src}`)
        loadedCount++
        if (mounted) {
          setLoaded(loadedCount)
          onProgress?.(loadedCount / total)
          if (loadedCount === total) onComplete?.()
        }
      }

      // Add timestamp to prevent caching
      img.src = addTimestampToUrl(src, timestamp)
    })

    return () => {
      mounted = false
    }
  }, [images, onProgress, onComplete, total])

  // This component doesn't render anything visible
  return null
}

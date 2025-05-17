"use client"

import { useEffect } from "react"

interface ImagePreloaderProps {
  images: string[]
}

export function ImagePreloader({ images }: ImagePreloaderProps) {
  useEffect(() => {
    // Function to preload an image
    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
        img.src = src
      })
    }

    // Preload all images
    const preloadAllImages = async () => {
      try {
        // Filter out empty or invalid URLs
        const validImages = images.filter((img) => img && typeof img === "string" && !img.includes("undefined"))

        // Preload in parallel
        await Promise.allSettled(validImages.map(preloadImage))
        console.log("Images preloaded successfully")
      } catch (error) {
        console.warn("Some images failed to preload:", error)
      }
    }

    if (images && images.length > 0) {
      preloadAllImages()
    }
  }, [images])

  // This component doesn't render anything
  return null
}

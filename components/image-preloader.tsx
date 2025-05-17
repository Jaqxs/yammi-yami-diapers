"use client"

import { useEffect } from "react"

interface ImagePreloaderProps {
  images: string[]
}

export function ImagePreloader({ images }: ImagePreloaderProps) {
  useEffect(() => {
    // Preload images
    images.forEach((src) => {
      if (!src) return

      const img = new Image()
      img.src = src
    })
  }, [images])

  // This component doesn't render anything
  return null
}

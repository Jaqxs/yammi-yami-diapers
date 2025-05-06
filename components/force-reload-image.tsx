"use client"

import { useState, useEffect, useRef } from "react"
import Image, { type ImageProps } from "next/image"
import { addCacheBuster } from "@/utils/cache-buster"

interface ForceReloadImageProps extends Omit<ImageProps, "src"> {
  src: string
  fallbackSrc?: string
  reloadInterval?: number // milliseconds
}

export function ForceReloadImage({ src, fallbackSrc, reloadInterval, alt, ...props }: ForceReloadImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src)
  const [error, setError] = useState<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Add cache buster and handle errors
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Initial load with cache buster
    setImageSrc(addCacheBuster(src))
    setError(false)

    // Set up reload interval if specified
    if (reloadInterval && reloadInterval > 0) {
      intervalRef.current = setInterval(() => {
        setImageSrc(addCacheBuster(src))
      }, reloadInterval)
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [src, reloadInterval])

  // Handle errors
  const handleError = () => {
    setError(true)
    if (fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
  }

  return <Image {...props} src={error && fallbackSrc ? fallbackSrc : imageSrc} alt={alt} onError={handleError} />
}

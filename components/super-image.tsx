"use client"

import { useState, useEffect, useRef } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

type SuperImageProps = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string
  quality?: number
  priority?: boolean
  className?: string
  imgClassName?: string
}

export function SuperImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className,
  imgClassName,
  quality = 85,
  priority = false,
  ...props
}: SuperImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const attemptRef = useRef(0)
  const maxAttempts = 3

  // Process the image source to handle different formats and add cache busting
  useEffect(() => {
    const processSource = () => {
      // Reset state when source changes
      setError(false)
      setLoaded(false)
      attemptRef.current = 0

      if (!src) {
        setError(true)
        return
      }

      // Handle string sources
      if (typeof src === "string") {
        // For remote URLs, add cache busting
        if (src.startsWith("http")) {
          const cacheBuster = `t=${Date.now()}`
          const separator = src.includes("?") ? "&" : "?"
          setImgSrc(`${src}${separator}${cacheBuster}`)
        }
        // For local paths, use as is
        else {
          setImgSrc(src)
        }
      }
      // For StaticImageData or other objects, use as is
      else {
        setImgSrc(null) // Will use src directly
      }
    }

    processSource()
  }, [src])

  // Handle image load success
  const handleLoad = () => {
    setLoaded(true)
    setError(false)
  }

  // Handle image load error with retries
  const handleError = () => {
    // Increment attempt counter
    attemptRef.current += 1

    // If we haven't exceeded max attempts, try again with a new cache buster
    if (attemptRef.current < maxAttempts && typeof src === "string") {
      console.log(`Image load failed, retrying (${attemptRef.current}/${maxAttempts}):`, src)

      // For remote URLs, add a new cache buster
      if (src.startsWith("http")) {
        const cacheBuster = `retry=${Date.now()}-${attemptRef.current}`
        const separator = src.includes("?") ? "&" : "?"
        setImgSrc(`${src}${separator}${cacheBuster}`)
      }
      // For local paths, try with a cache buster
      else if (!src.includes("?")) {
        setImgSrc(`${src}?retry=${Date.now()}-${attemptRef.current}`)
      }
      // If already has query params, add another
      else {
        setImgSrc(`${src}&retry=${Date.now()}-${attemptRef.current}`)
      }
    } else {
      // Max retries exceeded, show fallback
      console.warn(`Image load failed after ${maxAttempts} attempts:`, src)
      setError(true)
    }
  }

  // Determine final source
  const finalSrc = error ? fallbackSrc : imgSrc || src

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading indicator */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-8 h-8 border-4 border-yammy-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Actual image */}
      <Image
        ref={imgRef}
        src={finalSrc || "/placeholder.svg"}
        alt={alt}
        quality={quality}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={cn("transition-opacity duration-300", loaded && !error ? "opacity-100" : "opacity-0", imgClassName)}
        sizes={props.sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        {...props}
        unoptimized={true} // Skip Next.js image optimization to avoid caching issues
      />

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
          <span className="text-sm text-gray-500">Image could not be loaded</span>
        </div>
      )}
    </div>
  )
}

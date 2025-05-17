"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

type OptimizedImageProps = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string
  className?: string
  imgClassName?: string
  lowQualityPlaceholder?: boolean
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className,
  imgClassName,
  lowQualityPlaceholder = true,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 2

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true)
    setError(false)
    setRetryCount(0)

    // Process the source URL
    if (typeof src === "string") {
      // For remote URLs, add cache control parameters
      if (src.startsWith("http")) {
        // Add a small random value to prevent browser caching
        const cacheBuster = Math.floor(Math.random() * 1000)
        const separator = src.includes("?") ? "&" : "?"
        setImgSrc(`${src}${separator}v=${cacheBuster}`)
      } else {
        // For local paths, use as is
        setImgSrc(src)
      }
    } else {
      // For StaticImageData or other objects, use as is
      setImgSrc(null)
    }
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    setError(false)
  }

  const handleError = () => {
    if (retryCount < maxRetries) {
      // Try again with a different cache buster
      setRetryCount((prev) => prev + 1)
      const newCacheBuster = Date.now()
      const currentSrc = typeof src === "string" ? src : ""
      const separator = currentSrc.includes("?") ? "&" : "?"
      setImgSrc(`${currentSrc}${separator}retry=${newCacheBuster}`)
    } else {
      // Max retries reached, show fallback
      setError(true)
      setIsLoading(false)
    }
  }

  // Determine the final source to use
  const finalSrc = error ? fallbackSrc : imgSrc || src

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-yammy-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Low quality placeholder for smoother loading */}
      {lowQualityPlaceholder && isLoading && !error && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm opacity-50"
          style={{
            backgroundImage: `url(${typeof src === "string" ? src.replace(/\.(jpg|jpeg|png)/, "_thumb.$1") : fallbackSrc})`,
          }}
        />
      )}

      {/* The actual image */}
      <Image
        src={finalSrc || "/placeholder.svg"}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", imgClassName)}
        sizes={props.sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        quality={props.quality || 75}
        priority={props.priority || false}
        {...props}
      />

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-2">
          <div className="text-center">
            <div className="text-sm text-gray-500">Image not available</div>
          </div>
        </div>
      )}
    </div>
  )
}

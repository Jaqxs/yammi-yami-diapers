"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { bustCache } from "@/utils/cache-buster"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  fill?: boolean
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  objectPosition?: string
  fallbackSrc?: string
  unoptimized?: boolean
  style?: React.CSSProperties
}

// Define the component function
function OptimizedImageComponent({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  sizes,
  fill = false,
  objectFit = "cover",
  objectPosition = "center",
  fallbackSrc = "/placeholder.svg",
  unoptimized = true,
  style,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Add cache-busting timestamp to image URL
  useEffect(() => {
    // Only add timestamp for local images (not external URLs)
    if (src && !src.startsWith("http") && !src.startsWith("data:")) {
      const timestamp = new Date().getTime()
      setImgSrc(`${src}?t=${timestamp}`)
    } else {
      setImgSrc(src)
    }
  }, [src])

  // Apply cache busting to the src
  const cacheBustedSrc = typeof src === "string" ? bustCache(src, { useTimestamp: true }) : src

  return (
    <div
      className={cn("relative", className)}
      style={{
        minHeight: height ? `${height}px` : fill ? "100%" : "200px",
        minWidth: width ? `${width}px` : "100%",
        ...style,
      }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-500">Image failed to load</span>
        </div>
      )}

      <Image
        src={cacheBustedSrc || fallbackSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={cn(
          "transition-opacity duration-300",
          loading ? "opacity-0" : "opacity-100",
          error ? "hidden" : "block",
        )}
        style={{
          objectFit,
          objectPosition,
        }}
        priority={priority}
        quality={quality}
        sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
        fill={fill}
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
        unoptimized={unoptimized} // Disable Next.js image optimization to avoid caching issues
      />
    </div>
  )
}

// Export as both default and named export for compatibility
export default OptimizedImageComponent
export const OptimizedImage = OptimizedImageComponent

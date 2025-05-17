"use client"

import { useState, useEffect, useRef } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

type OptimizedImageProps = ImageProps & {
  fallbackSrc?: string
  quality?: number
  priority?: boolean
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  className,
  quality = 85,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    // Set mounted ref
    mountedRef.current = true

    // Cleanup function to set mounted ref to false when component unmounts
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    // Reset states when src changes
    if (mountedRef.current) {
      setIsLoading(true)
      setError(false)
    }

    // Process the image source
    const processImageSource = () => {
      // If src is null or undefined, use fallback
      if (!src) {
        if (mountedRef.current) {
          setError(true)
          setIsLoading(false)
        }
        return
      }

      // Ensure the src is properly formatted
      if (typeof src === "string") {
        // Handle relative paths for deployment
        let finalSrc = src

        // If it's a relative path that doesn't start with / or http, add /
        if (!src.startsWith("/") && !src.startsWith("http")) {
          finalSrc = `/${src}`
        }

        if (mountedRef.current) {
          setImgSrc(finalSrc)
        }
      } else {
        if (mountedRef.current) {
          setImgSrc(null)
        }
      }
    }

    processImageSource()
  }, [src])

  const handleLoad = () => {
    if (mountedRef.current) {
      setIsLoading(false)
      setError(false)
    }
  }

  const handleError = () => {
    if (mountedRef.current) {
      console.warn(`Image failed to load:`, src)
      setError(true)
      setIsLoading(false)
    }
  }

  // Determine the final src to use
  const finalSrc = error ? fallbackSrc : imgSrc || src

  return (
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-10 h-10 border-4 border-yammy-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Image
        src={finalSrc || "/placeholder.svg"}
        alt={alt}
        {...props}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        quality={quality}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", props.className)}
        sizes={props.sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        style={{
          objectFit: props.fill ? "contain" : "cover",
          width: "100%",
          height: "100%",
          ...props.style,
        }}
      />
    </div>
  )
}

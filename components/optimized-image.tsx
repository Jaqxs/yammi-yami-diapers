"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true)
    setError(false)

    // Add cache-busting parameter to image URLs
    if (typeof src === "string") {
      const timestamp = Date.now()
      const separator = src.includes("?") ? "&" : "?"
      setImgSrc(`${src}${separator}t=${timestamp}`)
    } else {
      setImgSrc(null)
    }
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  return (
    <div className={cn("relative overflow-hidden w-full h-full", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-10 h-10 border-4 border-yammy-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Image
        src={error ? fallbackSrc : imgSrc || src}
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

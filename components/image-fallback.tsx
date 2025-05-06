"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageFallbackProps {
  src: string
  fallbackSrc?: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
}

export function ImageFallback({
  src,
  fallbackSrc = "/placeholder.svg",
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
}: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(`${src}?t=${Date.now()}`)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    // Reset error state and update src with cache-busting when src prop changes
    setError(false)
    setImgSrc(`${src}?t=${Date.now()}`)
  }, [src])

  return (
    <div className={cn("relative", className)}>
      <Image
        src={error ? fallbackSrc : imgSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        priority={priority}
        fill={fill}
        onError={() => {
          // If we're already showing the fallback, don't try again
          if (imgSrc !== fallbackSrc) {
            console.warn(`Image failed to load: ${imgSrc}`)
            setError(true)
          }
        }}
        unoptimized={true}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  )
}

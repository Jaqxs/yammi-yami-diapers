"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  quality?: number
  sizes?: string
  fallbackSrc?: string
  onLoad?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  style,
  priority = false,
  quality = 75,
  sizes = "100vw",
  fallbackSrc = "/placeholder.svg",
  onLoad,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Update image source if it changes
  useEffect(() => {
    setImgSrc(src)
    setIsLoading(true)
    setError(false)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`)
    setError(true)
    setIsLoading(false)
    if (fallbackSrc && fallbackSrc !== src) {
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-yammy-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        quality={quality}
        sizes={sizes}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
        style={{
          objectFit: "contain",
          objectPosition: "center",
          ...style,
        }}
      />
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface FastImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  fallbackSrc?: string
  onLoad?: () => void
}

export function FastImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  quality = 75,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  fallbackSrc = "/assorted-products-display.png",
  onLoad,
}: FastImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Reset states when src changes
  useEffect(() => {
    setImgSrc(src)
    setIsLoading(true)
    setIsError(false)
  }, [src])

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  // Handle image load error
  const handleError = () => {
    setIsError(true)
    setIsLoading(false)
    setImgSrc(fallbackSrc)
  }

  return (
    <div className={cn("relative overflow-hidden", isLoading && "bg-gray-100", className)}>
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-4 border-yammy-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* The actual image */}
      <Image
        ref={imgRef}
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        quality={quality}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill ? "object-contain" : "",
        )}
        unoptimized={false}
      />
    </div>
  )
}

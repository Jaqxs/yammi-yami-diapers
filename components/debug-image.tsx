"use client"

import { useState } from "react"
import Image from "next/image"

interface DebugImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function DebugImage({ src, alt, width = 300, height = 300, className = "" }: DebugImageProps) {
  const [isError, setIsError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative">
      <Image
        src={isError ? "/placeholder.svg" : src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onError={() => {
          console.error(`Failed to load image: ${src}`)
          setIsError(true)
        }}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin h-8 w-8 border-4 border-yammy-blue border-t-transparent rounded-full"></div>
        </div>
      )}
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-red-500 text-xs p-2">
          <p>Error loading image:</p>
          <p className="truncate max-w-full">{src}</p>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ImageSliderProps {
  images: string[]
  title?: string
  subtitle?: string
  names?: string[]
  nicknames?: string[]
  autoplaySpeed?: number
  className?: string
}

export default function ImageSlider({
  images,
  title,
  subtitle,
  names = [],
  nicknames = [],
  autoplaySpeed = 3000,
  className = "",
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }, [images.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }, [images.length])

  useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      nextSlide()
    }, autoplaySpeed)

    return () => clearInterval(interval)
  }, [nextSlide, autoplaySpeed, isHovering])

  if (images.length === 0) {
    return null
  }

  const handleImageError = (index: number) => {
    console.error(`Error loading image at index ${index}:`, images[index])
    setImageError((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative aspect-[3/4] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={imageError[currentIndex] ? "/placeholder.svg" : images[currentIndex]}
              alt={`${title || "Image"} ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
            {names && names[currentIndex] && names[currentIndex].includes("Paula") && (
              <div className="absolute bottom-4 left-4 right-4 bg-yammy-pink/80 text-white py-1 px-3 rounded-full text-sm font-medium">
                Mother & Daughter Ambassador
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="p-4 bg-yammy-pink/20">
        <h3 className="font-bold text-yammy-dark-blue text-lg text-center">{title}</h3>
        <p className="text-center text-yammy-blue">{subtitle}</p>
        {names && names.length > 0 && (
          <p className="text-center text-yammy-dark-blue font-medium mt-1">
            {currentIndex === 0 && names.length > 1 ? names[1] : names[0]}
          </p>
        )}
        {nicknames && nicknames.length > 0 && (
          <p className="text-center text-gray-600 text-sm mt-0.5">
            @{currentIndex === 0 && nicknames.length > 1 ? nicknames[1] : nicknames[0]}
          </p>
        )}
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { mockProducts } from "@/data/mock-products"

export function ImagePreloader() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return

    // Function to preload an image
    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = src
        img.onload = resolve
        img.onerror = reject
        // Add to DOM to ensure it's cached
        img.style.display = "none"
        document.body.appendChild(img)
        // Remove after loading to clean up
        setTimeout(() => {
          if (document.body.contains(img)) {
            document.body.removeChild(img)
          }
        }, 5000)
      })
    }

    // Get all product images
    const productImages = mockProducts
      .map((product) => product.image)
      .filter((src): src is string => typeof src === "string")

    // Preload featured product images first
    const featuredImages = mockProducts
      .filter((product) => product.featured)
      .map((product) => product.image)
      .filter((src): src is string => typeof src === "string")

    // Preload featured images immediately
    featuredImages.forEach((src) => {
      preloadImage(src).catch(() => {
        console.log("Failed to preload featured image:", src)
      })
    })

    // Preload remaining images after a delay
    setTimeout(() => {
      const remainingImages = productImages.filter((src) => !featuredImages.includes(src))
      remainingImages.forEach((src) => {
        preloadImage(src).catch(() => {
          console.log("Failed to preload image:", src)
        })
      })
    }, 2000)
  }, [])

  return null
}

/**
 * Utility functions for image handling
 */

/**
 * Preloads an image by creating a new Image object and setting its src
 * @param src The image source URL
 * @returns A promise that resolves when the image is loaded or rejects on error
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error("No image source provided"))
      return
    }

    const img = new Image()

    img.onload = () => {
      resolve()
    }

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`))
    }

    img.src = src
  })
}

/**
 * Gets a fallback image based on product category
 * @param category The product category
 * @returns The fallback image URL
 */
export function getCategoryFallbackImage(category?: string): string {
  if (category === "babyDiapers" || category === "babyPants") {
    return "/images/baby-diapers.png"
  } else if (category === "adultDiapers") {
    return "/images/diaper-features.png"
  } else if (category === "ladyPads") {
    return "/images/lady-pads.png"
  }
  return "/assorted-products-display.png"
}

/**
 * Ensures an image URL is valid, returning a fallback if not
 * @param url The image URL to check
 * @param fallback The fallback URL to use if the provided URL is invalid
 * @returns A valid image URL
 */
export function ensureValidImageUrl(url?: string, fallback = "/placeholder.svg"): string {
  if (!url || url.trim() === "") {
    return fallback
  }
  return url
}

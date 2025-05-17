/**
 * Utility functions for handling images
 */

/**
 * Add a timestamp to an image URL to prevent caching
 * @param url The image URL
 * @param timestamp Optional timestamp to use (defaults to current time)
 * @returns URL with timestamp parameter
 */
export function addTimestampToUrl(url: string, timestamp: number = Date.now()): string {
  if (!url) return "/placeholder.svg"

  // If URL already has a query parameter, add timestamp
  if (url.includes("?")) {
    return `${url}&t=${timestamp}`
  }

  // Otherwise add timestamp as a new query parameter
  return `${url}?t=${timestamp}`
}

/**
 * Get a fallback image URL based on the image type
 * @param type The type of image (blog, product, etc.)
 * @returns Fallback image URL
 */
export function getFallbackImage(type: "blog" | "product" | "ambassador" | "team" | "general" = "general"): string {
  switch (type) {
    case "blog":
      return "/blog-post-concept.png"
    case "product":
      return "/diverse-products-still-life.png"
    case "ambassador":
      return "/diverse-group.png"
    case "team":
      return "/professional-teamwork.png"
    default:
      return "/placeholder.svg"
  }
}

/**
 * Check if an image URL is valid
 * @param url The image URL to check
 * @returns Boolean indicating if the URL is valid
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false

  // Check if URL is a placeholder
  if (url.includes("placeholder.svg")) return true

  // Check if URL is a valid URL format
  try {
    new URL(url)
    return true
  } catch (e) {
    // If URL is a relative path, it's valid
    return url.startsWith("/")
  }
}

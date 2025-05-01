/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function to limit how often a function can be called
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Check if an element is in viewport
 */
export function isInViewport(element: HTMLElement, offset = 0): boolean {
  if (!element) return false

  const rect = element.getBoundingClientRect()

  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.bottom >= 0 - offset &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) + offset &&
    rect.right >= 0 - offset
  )
}

/**
 * Get device type
 */
export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const width = typeof window !== "undefined" ? window.innerWidth : 0

  if (width < 768) return "mobile"
  if (width < 1024) return "tablet"
  return "desktop"
}

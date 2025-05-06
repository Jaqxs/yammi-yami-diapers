export function addCacheBuster(url: string): string {
  if (!url) return url

  try {
    // Skip for data URLs and blob URLs
    if (url.startsWith("data:") || url.startsWith("blob:")) {
      return url
    }

    const urlObj = new URL(url, window.location.origin)
    urlObj.searchParams.set("t", Date.now().toString())
    return urlObj.toString()
  } catch (error) {
    // If URL parsing fails, append the timestamp as a query parameter
    const separator = url.includes("?") ? "&" : "?"
    return `${url}${separator}t=${Date.now()}`
  }
}

export function forceReloadImages(): void {
  if (typeof document === "undefined") return

  document.querySelectorAll("img").forEach((img) => {
    const currentSrc = img.src
    if (currentSrc && !currentSrc.startsWith("data:") && !currentSrc.startsWith("blob:")) {
      const newSrc = addCacheBuster(currentSrc)
      img.src = newSrc
    }
  })
}

export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = (err) => reject(err)
    img.src = addCacheBuster(url)
  })
}

// Add the missing prefetchImage export as an alias to preloadImage
export const prefetchImage = preloadImage

export const bustCache = (url: string, options?: { useTimestamp: boolean }): string => {
  if (!url) return ""
  if (options?.useTimestamp) {
    return addCacheBuster(url)
  }
  return url
}

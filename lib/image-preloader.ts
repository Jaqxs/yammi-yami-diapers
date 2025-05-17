/**
 * Preloads images to browser cache
 * @param urls Array of image URLs to preload
 * @param options Configuration options
 */
export function preloadImages(
  urls: string[],
  options: {
    concurrency?: number
    onProgress?: (loaded: number, total: number) => void
    onComplete?: () => void
  } = {},
) {
  const { concurrency = 4, onProgress, onComplete } = options
  let loaded = 0
  const total = urls.length

  // Create a queue of URLs to load
  const queue = [...urls]
  let active = 0

  // Function to load the next image in the queue
  const loadNext = () => {
    if (queue.length === 0 || active >= concurrency) return

    active++
    const url = queue.shift()!
    const img = new Image()

    img.onload = img.onerror = () => {
      loaded++
      active--

      // Report progress
      onProgress?.(loaded, total)

      // Load the next image or complete
      if (queue.length > 0) {
        loadNext()
      } else if (active === 0) {
        onComplete?.()
      }
    }

    img.src = url
  }

  // Start loading images up to concurrency limit
  for (let i = 0; i < Math.min(concurrency, queue.length); i++) {
    loadNext()
  }
}

/**
 * Preloads images for a specific product category
 * @param category Product category
 */
export function preloadCategoryImages(category: string) {
  const categoryImageMap: Record<string, string[]> = {
    babyDiapers: ["/images/baby-diapers.png"],
    babyPants: ["/images/baby-diapers.png"],
    adultDiapers: ["/images/diaper-features.png"],
    ladyPads: ["/images/lady-pads.png"],
  }

  const imagesToPreload = categoryImageMap[category] || []
  if (imagesToPreload.length > 0) {
    preloadImages(imagesToPreload, { concurrency: 2 })
  }
}

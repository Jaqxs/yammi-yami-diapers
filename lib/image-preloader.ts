/**
 * Image Preloader Service
 * Preloads important images to improve perceived performance
 */

// Preload a single image
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject()
    img.src = src
  })
}

// Preload multiple images with priority
export const preloadImages = async (
  images: string[],
  options: {
    concurrency?: number
    onProgress?: (loaded: number, total: number) => void
  } = {},
): Promise<void> => {
  const { concurrency = 3, onProgress } = options
  let loaded = 0
  const total = images.length

  // Process images in batches to avoid overwhelming the browser
  for (let i = 0; i < total; i += concurrency) {
    const batch = images.slice(i, i + concurrency)
    await Promise.allSettled(
      batch.map((src) =>
        preloadImage(src)
          .then(() => {
            loaded++
            onProgress?.(loaded, total)
          })
          .catch(() => {
            loaded++
            onProgress?.(loaded, total)
            console.warn(`Failed to preload image: ${src}`)
          }),
      ),
    )
  }
}

// Preload category-specific images
export const preloadCategoryImages = (category: string): void => {
  const categoryImages: Record<string, string[]> = {
    babyDiapers: [
      "/images/baby-diapers.png",
      // Add more category-specific images here
    ],
    adultDiapers: [
      "/images/diaper-features.png",
      // Add more category-specific images here
    ],
    ladyPads: [
      "/images/lady-pads.png",
      // Add more category-specific images here
    ],
  }

  const imagesToPreload = categoryImages[category] || []
  if (imagesToPreload.length > 0) {
    preloadImages(imagesToPreload, { concurrency: 2 })
  }
}

// Preload featured product images
export const preloadFeaturedProductImages = (products: any[]): void => {
  const imagesToPreload = products
    .filter((product) => product.featured && product.image)
    .map((product) => product.image)
    .slice(0, 4) // Only preload the first 4 featured products

  if (imagesToPreload.length > 0) {
    preloadImages(imagesToPreload, { concurrency: 2 })
  }
}

/// <reference lib="webworker" />

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = "yammy-yami-image-cache-v1"
const IMAGE_CACHE_NAME = "yammy-yami-image-cache-v1"

// Add all image paths that should be cached
const PRECACHE_IMAGE_URLS = [
  "/images/baby-diapers.png",
  "/images/diaper-features.png",
  "/images/lady-pads.png",
  "/assorted-products-display.png",
  "/images/yammy-yami-mother-baby.png",
  "/images/diaper-sizes.png",
]

// Install event - precache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Cache critical images
      caches
        .open(IMAGE_CACHE_NAME)
        .then((cache) => {
          return cache.addAll(PRECACHE_IMAGE_URLS)
        }),
    ]).then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, IMAGE_CACHE_NAME]
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return

  // Only cache image requests
  const url = new URL(event.request.url)
  const isImage = /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(url.pathname)

  if (isImage) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Return cached response if available
          if (cachedResponse) {
            return cachedResponse
          }

          // Otherwise fetch from network, cache, and return
          return fetch(event.request).then((response) => {
            // Clone the response since we need to use it twice
            const responseToCache = response.clone()

            // Only cache successful responses
            if (response.status === 200) {
              cache.put(event.request, responseToCache)
            }

            return response
          })
        })
      }),
    )
  }
})

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_IMAGE_CACHE") {
    event.waitUntil(
      caches.delete(IMAGE_CACHE_NAME).then(() => {
        // Recreate the cache with precached images
        return caches.open(IMAGE_CACHE_NAME).then((cache) => {
          return cache.addAll(PRECACHE_IMAGE_URLS)
        })
      }),
    )
  }
})

// Export empty object to satisfy TypeScript
export {}

export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = "/service-worker.js"

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope)

          // Check for updates every minute
          setInterval(() => {
            registration
              .update()
              .then(() => {
                console.log("Service worker checked for updates")
              })
              .catch((err) => {
                console.error("Error updating service worker:", err)
              })
          }, 60000)

          // Force update on page navigation
          let lastPath = window.location.pathname
          setInterval(() => {
            if (lastPath !== window.location.pathname) {
              lastPath = window.location.pathname
              console.log("Page navigation detected, updating service worker")
              registration.update()

              // Clear image cache
              if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                  type: "CLEAR_IMAGE_CACHE",
                })
              }
            }
          }, 300)
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "CACHE_CLEARED") {
          console.log("Image cache cleared by service worker")

          // Force reload visible images
          document.querySelectorAll("img").forEach((img) => {
            const currentSrc = img.src
            if (currentSrc && !currentSrc.startsWith("data:") && !currentSrc.startsWith("blob:")) {
              const url = new URL(currentSrc)
              url.searchParams.set("t", Date.now().toString())
              img.src = url.toString()
            }
          })
        }
      })
    })
  }
}

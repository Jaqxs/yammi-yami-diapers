"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Database, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export function AdminSyncNotification() {
  const [showNotification, setShowNotification] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { refreshProducts } = useStore()

  // Check for updates every 30 seconds
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch("/api/products?_check=true", {
          method: "HEAD",
          headers: { "Cache-Control": "no-cache" },
        })

        const lastModified = response.headers.get("Last-Modified")
        const storedLastModified = localStorage.getItem("products-last-modified")

        if (lastModified && lastModified !== storedLastModified) {
          setShowNotification(true)
          localStorage.setItem("products-last-modified", lastModified)
        }
      } catch (error) {
        // Silent fail - don't show notification if check fails
      }
    }

    const interval = setInterval(checkForUpdates, 30000) // Check every 30 seconds
    checkForUpdates() // Initial check

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshProducts()
      setShowNotification(false)
    } catch (error) {
      console.error("Failed to refresh products:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-yammy-blue text-white p-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium">Products Updated!</h4>
                <p className="text-sm opacity-90">New changes are available from admin.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="secondary" onClick={handleRefresh} disabled={isRefreshing} className="flex-1">
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                {isRefreshing ? "Updating..." : "Update Now"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNotification(false)}
                className="text-white hover:bg-white/20"
              >
                Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

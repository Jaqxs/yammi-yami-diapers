"use client"

import { useEffect, useState } from "react"
import { useStoreSync } from "@/lib/store-sync"
import { CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AdminChangeNotification() {
  const { lastEvent } = useStoreSync()
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (lastEvent) {
      // Create a message based on the event
      let actionText = ""
      switch (lastEvent.action) {
        case "add":
          actionText = "added"
          break
        case "update":
          actionText = "updated"
          break
        case "delete":
          actionText = "deleted"
          break
      }

      let typeText = ""
      switch (lastEvent.type) {
        case "product":
          typeText = "product"
          break
        case "blogPost":
          typeText = "blog post"
          break
        case "order":
          typeText = "order"
          break
      }

      setMessage(`A ${typeText} was ${actionText}. The page has been updated.`)
      setVisible(true)

      // Hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [lastEvent])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-md"
        >
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">Content Updated</h3>
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Database, Loader2 } from "lucide-react"

export function InitDatabaseButton() {
  const [isInitializing, setIsInitializing] = useState(false)
  const { toast } = useToast()

  const initializeDatabase = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch("/api/admin/init-database", {
        method: "POST",
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
          variant: "default",
        })
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        toast({
          title: "Initialization Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error initializing database:", error)
      toast({
        title: "Error",
        description: "Failed to initialize database",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <Button onClick={initializeDatabase} disabled={isInitializing} className="bg-blue-600 hover:bg-blue-700" size="sm">
      {isInitializing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
      {isInitializing ? "Initializing..." : "Initialize Database"}
    </Button>
  )
}

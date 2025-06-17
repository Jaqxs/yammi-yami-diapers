"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"

export function RestoreProductsButton() {
  const [isRestoring, setIsRestoring] = useState(false)
  const { loadProducts } = useStore()

  const handleRestore = async () => {
    setIsRestoring(true)
    try {
      // Call restore API
      const response = await fetch("/api/admin/restore-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        // Reload products
        await loadProducts()

        toast({
          title: "Success!",
          description: "Original products have been restored successfully!",
          variant: "default",
          duration: 5000,
        })

        // Force page refresh to show changes
        window.location.reload()
      } else {
        throw new Error("Failed to restore products")
      }
    } catch (error) {
      console.error("Error restoring products:", error)
      toast({
        title: "Error",
        description: "Failed to restore original products. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <Button onClick={handleRestore} disabled={isRestoring} className="bg-red-500 hover:bg-red-600 text-white">
      <RefreshCw className={`h-4 w-4 mr-2 ${isRestoring ? "animate-spin" : ""}`} />
      {isRestoring ? "Restoring..." : "Restore Original Products"}
    </Button>
  )
}

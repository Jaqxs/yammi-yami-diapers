"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"

export function ReimportProductsButton() {
  const [isReimporting, setIsReimporting] = useState(false)
  const { refreshProducts } = useStore()

  const handleReimport = async () => {
    if (!confirm("This will completely replace all products in your database. Are you sure?")) {
      return
    }

    setIsReimporting(true)

    try {
      console.log("🚀 Starting complete re-import...")
      const response = await fetch("/api/admin/reimport-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log("📥 Re-import result:", data)

      if (data.success) {
        toast({
          title: "Success!",
          description: `${data.message}. Categories: ${data.stats.categoryBreakdown.map((c: any) => `${c.category}(${c.count})`).join(", ")}`,
          variant: "default",
        })

        // Wait a moment then refresh everything
        setTimeout(async () => {
          await refreshProducts()
          window.location.reload() // Force full page refresh to clear any cached data
        }, 1000)
      } else {
        throw new Error(data.error || "Failed to re-import products")
      }
    } catch (error) {
      console.error("Error re-importing products:", error)

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to re-import products",
        variant: "destructive",
      })
    } finally {
      setIsReimporting(false)
    }
  }

  return (
    <Button onClick={handleReimport} disabled={isReimporting} className="bg-orange-600 hover:bg-orange-700 text-white">
      {isReimporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Re-importing...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Re-Import All Products
        </>
      )}
    </Button>
  )
}

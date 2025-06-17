"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"

export function ImportProductsButton() {
  const [isImporting, setIsImporting] = useState(false)
  const { refreshProducts } = useStore()

  const handleImport = async () => {
    setIsImporting(true)

    try {
      const response = await fetch("/api/admin/import-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: data.message,
          variant: "default",
        })

        // Refresh products in store
        await refreshProducts()
      } else {
        throw new Error(data.error || "Failed to import products")
      }
    } catch (error) {
      console.error("Error importing products:", error)

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import products",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Button onClick={handleImport} disabled={isImporting} className="bg-green-600 hover:bg-green-700 text-white">
      {isImporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Importing...
        </>
      ) : (
        <>
          <Database className="mr-2 h-4 w-4" />
          Import Products to Database
        </>
      )}
    </Button>
  )
}

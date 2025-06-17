"use client"

import { useState } from "react"
import { Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useStore } from "@/lib/store"
import { mockProducts } from "@/data/mock-products"

export function DebugProductsButton() {
  const { products, loadProducts } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleDebug = async () => {
    try {
      // Collect debug information
      const info = {
        storeProducts: products,
        mockProductsCount: mockProducts.length,
        localStorage: {
          products: localStorage.getItem("yammy-products"),
          sync: localStorage.getItem("yammy-products-sync"),
          source: localStorage.getItem("yammy-products-source"),
        },
      }

      setDebugInfo(info)
      setIsOpen(true)
    } catch (error) {
      console.error("Debug error:", error)
      setDebugInfo({ error: String(error) })
      setIsOpen(true)
    }
  }

  const handleForceLoad = () => {
    // Force load mock products directly
    useStore.setState({
      products: mockProducts,
      isLoading: false,
      error: null,
      lastSync: new Date(),
      dataSource: "fallback",
    })
    setDebugInfo({ message: "Forced load of mock products", count: mockProducts.length })
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleDebug}>
        <Bug className="h-4 w-4 mr-2" />
        Debug Products
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Products Debug Information</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-md">
              <h3 className="font-bold mb-2">Store Products Count: {products.length}</h3>
              <h3 className="font-bold mb-2">Mock Products Count: {mockProducts.length}</h3>

              <div className="flex gap-2 mt-4">
                <Button onClick={handleForceLoad}>Force Load Mock Products</Button>
                <Button onClick={() => loadProducts()}>Reload Products</Button>
                <Button
                  onClick={() => {
                    localStorage.clear()
                    window.location.reload()
                  }}
                >
                  Clear Storage & Reload
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gray-100 rounded-md overflow-auto">
              <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

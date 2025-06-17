"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bug } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function DebugProductsApi() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [debugData, setDebugData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDebug = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/products")
      const data = await response.json()

      setDebugData(data)
      setIsOpen(true)
    } catch (err) {
      setError("Failed to fetch debug data")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleDebug} disabled={isLoading}>
        <Bug className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
        Debug API
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Products API Debug</DialogTitle>
            <DialogDescription>Technical information about your products API and database connection</DialogDescription>
          </DialogHeader>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">{error}</div>}

          {debugData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                  <h3 className="font-medium text-green-800">Connection Status</h3>
                  <p className="text-green-700">{debugData.success ? "✅ Connected" : "❌ Failed"}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800">Products Count</h3>
                  <p className="text-blue-700">{debugData.totalCount || 0} products</p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                <h3 className="font-medium mb-2">Sample Product</h3>
                <pre className="text-xs overflow-auto max-h-40 bg-gray-100 p-2 rounded">
                  {JSON.stringify(debugData.sampleProduct, null, 2)}
                </pre>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                <h3 className="font-medium mb-2">All Products (Limited to 20)</h3>
                <pre className="text-xs overflow-auto max-h-60 bg-gray-100 p-2 rounded">
                  {JSON.stringify(debugData.allProducts, null, 2)}
                </pre>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                <h3 className="font-medium mb-2">Environment</h3>
                <p>Connection String: {debugData.connectionString}</p>
                <p>Environment: {debugData.environment}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

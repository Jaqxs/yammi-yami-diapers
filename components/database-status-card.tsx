"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Database, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { InitDatabaseButton } from "./init-database-button"

interface DatabaseStatus {
  success: boolean
  status: string
  message: string
  tableExists: boolean
  productCount: number
  sampleProducts?: any[]
  categoryBreakdown?: any[]
}

export function DatabaseStatusCard() {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/db-status")
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      console.error("Error fetching database status:", error)
      setDbStatus({
        success: false,
        status: "error",
        message: "Failed to check database status",
        tableExists: false,
        productCount: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="h-4 w-4 animate-spin" />
    if (dbStatus?.status === "connected") return <CheckCircle className="h-4 w-4 text-green-600" />
    if (dbStatus?.status === "error") return <AlertTriangle className="h-4 w-4 text-red-600" />
    return <Info className="h-4 w-4 text-blue-600" />
  }

  const getStatusColor = () => {
    if (dbStatus?.status === "connected") return "text-green-600"
    if (dbStatus?.status === "error") return "text-red-600"
    return "text-blue-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status
          <Button onClick={fetchStatus} size="sm" variant="outline" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
        <CardDescription>Current status of your Neon database connection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {dbStatus && (
          <>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className={`font-medium ${getStatusColor()}`}>
                {dbStatus.status === "connected" ? "Connected" : dbStatus.status === "error" ? "Error" : "Unknown"}
              </span>
            </div>

            <div className="text-sm text-gray-600">{dbStatus.message}</div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Table Exists</div>
                <Badge variant={dbStatus.tableExists ? "default" : "destructive"}>
                  {dbStatus.tableExists ? "Yes" : "No"}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium">Product Count</div>
                <div className="text-2xl font-bold">{dbStatus.productCount}</div>
              </div>
            </div>

            {dbStatus.categoryBreakdown && dbStatus.categoryBreakdown.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {dbStatus.categoryBreakdown.map((cat: any) => (
                    <Badge key={cat.category} variant="outline">
                      {cat.category}: {cat.count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {!dbStatus.tableExists && dbStatus.status === "connected" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your database is connected but the products table doesn't exist yet.
                  <div className="mt-2">
                    <InitDatabaseButton />
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {dbStatus.productCount === 0 && dbStatus.tableExists && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Your database table exists but has no products. Use the "Re-Import All Products" button to populate
                  it.
                </AlertDescription>
              </Alert>
            )}

            {dbStatus.status === "error" && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Database connection failed. Check your DATABASE_URL environment variable in the "Database Setup" tab.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

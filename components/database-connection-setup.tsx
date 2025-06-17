"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle, Database } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DatabaseConnectionSetupProps {
  connectionString: string
}

export function DatabaseConnectionSetup({ connectionString }: DatabaseConnectionSetupProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied!",
      description: "Connection string copied to clipboard",
    })
  }

  const testConnection = async () => {
    try {
      const response = await fetch("/api/admin/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionString }),
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: "Connection Successful!",
          description: "Your Neon database is connected and ready",
        })
      } else {
        toast({
          title: "Connection Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not test the connection",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Connection Setup
          </CardTitle>
          <CardDescription>Configure your Neon PostgreSQL database connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Great!</strong> You have your Neon database connection string. Follow these steps to set it up:
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Step 1: Add to Environment Variables</h4>
              <p className="text-sm text-gray-600 mb-2">
                Add this to your environment variables (in Vercel dashboard or .env file):
              </p>
              <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm break-all">
                <div className="flex items-center justify-between">
                  <span>DATABASE_URL={connectionString}</span>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`DATABASE_URL=${connectionString}`)}>
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Step 2: Test Connection</h4>
              <p className="text-sm text-gray-600 mb-2">Verify that the database connection works:</p>
              <Button onClick={testConnection} variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Test Database Connection
              </Button>
            </div>

            <div>
              <h4 className="font-medium mb-2">Step 3: Import Products</h4>
              <p className="text-sm text-gray-600 mb-2">Once connected, import your products to the database:</p>
              <Badge variant="secondary">Use the "Import Products" button in the admin dashboard</Badge>
            </div>
          </div>

          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> Never share your database connection string publicly. It contains your
              database credentials.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">1</Badge>
              <span className="text-sm">Add DATABASE_URL to environment variables</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">2</Badge>
              <span className="text-sm">Test the database connection</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">3</Badge>
              <span className="text-sm">Import your 13 products to the database</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">4</Badge>
              <span className="text-sm">Verify products appear in admin dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">5</Badge>
              <span className="text-sm">Check that website uses database products</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

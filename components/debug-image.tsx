"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OptimizedImage } from "./optimized-image"

export function DebugImage() {
  const [imageUrl, setImageUrl] = useState("")
  const [testResults, setTestResults] = useState<{ url: string; status: string; time: number }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const testImage = async (url: string): Promise<{ status: string; time: number }> => {
    const startTime = performance.now()
    try {
      const response = await fetch(url, { method: "HEAD", cache: "no-store" })
      const endTime = performance.now()
      return {
        status: response.ok ? "Success" : `Failed: ${response.status} ${response.statusText}`,
        time: Math.round(endTime - startTime),
      }
    } catch (error) {
      const endTime = performance.now()
      return {
        status: `Error: ${error instanceof Error ? error.message : String(error)}`,
        time: Math.round(endTime - startTime),
      }
    }
  }

  const handleTest = async () => {
    if (!imageUrl) return

    setIsLoading(true)
    try {
      // Test the original URL
      const result = await testImage(imageUrl)

      // Test with cache busting
      const cacheBustUrl = `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}t=${Date.now()}`
      const cacheBustResult = await testImage(cacheBustUrl)

      setTestResults([
        { url: imageUrl, ...result },
        { url: cacheBustUrl, ...cacheBustResult },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Image Debug Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="image-url">Image URL to test</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL to test"
                className="flex-1"
              />
              <Button onClick={handleTest} disabled={isLoading}>
                {isLoading ? "Testing..." : "Test Image"}
              </Button>
            </div>
          </div>

          {imageUrl && (
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Preview</h3>
              <div className="h-64 relative bg-gray-100 rounded-md overflow-hidden">
                <OptimizedImage
                  src={imageUrl}
                  alt="Test image"
                  fill
                  className="object-contain"
                  fallbackSrc="/test-image.png"
                />
              </div>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Test Results</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm border-b pb-2">
                    <div className="font-medium truncate">{result.url}</div>
                    <div className={`${result.status.startsWith("Success") ? "text-green-600" : "text-red-600"}`}>
                      {result.status} ({result.time}ms)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

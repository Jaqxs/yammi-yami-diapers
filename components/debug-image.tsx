"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OptimizedImage } from "@/components/optimized-image"

export function DebugImage() {
  const [imageUrl, setImageUrl] = useState("")
  const [showDebug, setShowDebug] = useState(false)
  const [testResults, setTestResults] = useState<{ url: string; success: boolean; error?: string }[]>([])

  const toggleDebug = () => {
    setShowDebug(!showDebug)
  }

  const testImage = async (url: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  const runTests = async () => {
    if (!imageUrl) return

    const results = []

    // Test direct URL
    try {
      const directSuccess = await testImage(imageUrl)
      results.push({ url: imageUrl, success: directSuccess })
    } catch (error) {
      results.push({ url: imageUrl, success: false, error: error.message })
    }

    // Test with cache busting
    try {
      const cacheBustUrl = `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}t=${Date.now()}`
      const cacheBustSuccess = await testImage(cacheBustUrl)
      results.push({ url: cacheBustUrl, success: cacheBustSuccess })
    } catch (error) {
      results.push({
        url: `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}t=${Date.now()}`,
        success: false,
        error: error.message,
      })
    }

    // Test with unoptimized Next.js Image
    try {
      const unoptimizedSuccess = await testImage(imageUrl)
      results.push({ url: `${imageUrl} (unoptimized)`, success: unoptimizedSuccess })
    } catch (error) {
      results.push({ url: `${imageUrl} (unoptimized)`, success: false, error: error.message })
    }

    setTestResults(results)
  }

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="sm" onClick={toggleDebug}>
          Debug Images
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Image Debugger
            <Button variant="ghost" size="sm" onClick={toggleDebug}>
              Close
            </Button>
          </CardTitle>
          <CardDescription>Test image loading and troubleshoot issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="test">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="test">Test Image</TabsTrigger>
              <TabsTrigger value="info">Debug Info</TabsTrigger>
            </TabsList>
            <TabsContent value="test" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL to test</Label>
                <Input
                  id="imageUrl"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <Button onClick={runTests} className="w-full">
                Test Image
              </Button>

              {testResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Test Results:</h4>
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${
                        result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      <div className="font-medium">{result.success ? "✓ Success" : "✗ Failed"}</div>
                      <div className="text-xs break-all">{result.url}</div>
                      {result.error && <div className="text-xs italic mt-1">{result.error}</div>}
                    </div>
                  ))}
                </div>
              )}

              {imageUrl && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Preview:</h4>
                  <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
                    <OptimizedImage src={imageUrl} alt="Test image" fill className="object-contain" />
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="info">
              <div className="space-y-2 text-sm">
                <h4 className="font-medium">Browser Info:</h4>
                <p>User Agent: {navigator.userAgent}</p>
                <p>
                  Window Size: {window.innerWidth}x{window.innerHeight}
                </p>

                <h4 className="font-medium mt-4">Image Config:</h4>
                <p>Unoptimized: true</p>
                <p>Cache TTL: 0</p>
                <p>Domains: v0.blob.vercel-storage.com, hebbkx1anhila5yf.public.blob.vercel-storage.com, blob.v0.dev</p>

                <h4 className="font-medium mt-4">Common Issues:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>CORS restrictions</li>
                  <li>Invalid image paths</li>
                  <li>CDN caching issues</li>
                  <li>Image format not supported</li>
                  <li>Next.js Image optimization issues</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-xs text-gray-500">This debugger only appears in development mode</CardFooter>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem("cookie-consent")
    if (!hasConsent) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true")
    setShowConsent(false)
    // Reload the page to activate analytics after consent
    window.location.reload()
  }

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "false")
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/80 backdrop-blur-sm">
      <Card className="max-w-4xl mx-auto border shadow-lg">
        <CardHeader>
          <CardTitle>Cookie Consent</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
            traffic. By clicking "Accept All", you consent to our use of cookies as described in our Cookie Policy.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={declineCookies}>
            Decline
          </Button>
          <Button onClick={acceptCookies}>Accept All</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

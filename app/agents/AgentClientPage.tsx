"use client"

import { useState, useEffect } from "react"
import { RegistrationForm } from "@/components/registration-form"
import { AgentPricing } from "@/components/agent-pricing"
import { useRegistrationStore } from "@/lib/registration-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, RefreshCw } from "lucide-react"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"

export default function AgentClientPage() {
  const { status, email, checkRegistrationStatus } = useRegistrationStore()
  const [currentStatus, setCurrentStatus] = useState(status)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Check for status updates
  useEffect(() => {
    if (email) {
      const updatedStatus = checkRegistrationStatus(email)
      setCurrentStatus(updatedStatus)
    } else {
      setCurrentStatus(status)
    }
  }, [status, email, checkRegistrationStatus])

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      if (email) {
        const updatedStatus = checkRegistrationStatus(email)
        setCurrentStatus(updatedStatus)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [email, checkRegistrationStatus])

  const handleRefreshStatus = () => {
    if (email) {
      setIsRefreshing(true)
      // Simulate a network request
      setTimeout(() => {
        const updatedStatus = checkRegistrationStatus(email)
        setCurrentStatus(updatedStatus)
        setIsRefreshing(false)
      }, 1000)
    }
  }

  const isApproved = currentStatus === "approved"
  const isPending = currentStatus === "pending"

  return (
    <PageWrapper>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Become a Yammy Yami Agent</h1>
          <p className="text-xl text-gray-600 mb-8">
            Join our network of distributors and earn up to 25% discount on our premium products
          </p>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
                <CardDescription>Why become a Yammy Yami agent?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <p>Exclusive agent pricing with up to 25% discount</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <p>Priority customer support</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <p>Flexible payment terms for qualified agents</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <p>Marketing materials and product training</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>What you need to become an agent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm">1</span>
                  </div>
                  <p>Valid business registration or trading license</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm">2</span>
                  </div>
                  <p>Physical store or distribution capability</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm">3</span>
                  </div>
                  <p>Minimum initial order of 10 boxes</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2">
              {isPending && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Registration Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                        <span className="text-yellow-600 text-xl">⌛</span>
                      </div>
                      <h3 className="text-lg font-medium mb-2">Your application is pending</h3>
                      <p className="text-gray-500 mb-4">
                        Our team is reviewing your application. This usually takes 1-2 business days.
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleRefreshStatus}
                        disabled={isRefreshing}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        {isRefreshing ? "Checking status..." : "Check status"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              <RegistrationForm />
            </div>
            <div className="lg:col-span-3">
              {isApproved ? (
                <AgentPricing />
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Agent Pricing</CardTitle>
                        <CardDescription>Exclusive pricing for registered agents</CardDescription>
                      </div>
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Agent Pricing is Locked</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Register as an agent to unlock exclusive pricing information and resources. Complete the
                      registration form to get started.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

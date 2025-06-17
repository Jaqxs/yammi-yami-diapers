"use client"

import { useState } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AgentClientPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [region, setRegion] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setName("")
      setEmail("")
      setPhone("")
      setRegion("")
      setMessage("")
    }, 1500)
  }

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
                  <p>Marketing materials and support</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <p>Flexible payment terms</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>What we look for in our agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <p>Valid business registration or license</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <p>Established customer base or retail location</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <p>Commitment to quality customer service</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm">•</span>
                  </div>
                  <p>Minimum order quantities</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agent Application</CardTitle>
              <CardDescription>Fill out the form below to apply for our agent program</CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
                  <p className="text-gray-600">
                    Thank you for your interest. We'll review your application and get back to you within 2-3 business
                    days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="region" className="block text-sm font-medium mb-2">
                        Region/Location *
                      </label>
                      <input
                        type="text"
                        id="region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Tell us about your business
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your business, customer base, and why you'd like to become a Yammy Yami agent..."
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions?</h2>
            <p className="text-gray-600 mb-6">Contact our agent support team for more information about our program</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">Call: +255 658 181 863</Button>
              <Button variant="outline">Email: agents@yammyyami.com</Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

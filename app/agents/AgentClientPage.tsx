"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageWrapper } from "@/components/page-wrapper"
import { RegistrationForm } from "@/components/registration-form"
import { AgentPricing } from "@/components/agent-pricing"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, FileText, Users } from "lucide-react"

export default function AgentClientPage() {
  const [activeTab, setActiveTab] = useState("register")
  const [isRegistered, setIsRegistered] = useState(false)

  // Check if user is already registered
  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("yammy-current-user") || "{}")
      if (currentUser.isRegistered) {
        setIsRegistered(true)
        setActiveTab("pricing")
      }
    } catch (error) {
      console.error("Error checking registration status:", error)
    }
  }, [])

  // Handle registration completion
  const handleRegistrationComplete = () => {
    setIsRegistered(true)
    setActiveTab("pricing")
  }

  return (
    <PageWrapper>
      <section className="py-12 px-4 bg-gradient-to-b from-yammy-light-blue/20 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bubblegum text-yammy-blue mb-4">Become a Yammy Yami Agent</h1>
            <p className="text-xl text-yammy-dark-blue max-w-3xl mx-auto">
              Join our network of successful agents and gain access to exclusive pricing, marketing materials, and
              dedicated support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yammy-light-blue/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-yammy-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple Registration</h3>
              <p className="text-gray-600">
                Complete our easy registration form with your business details to get started.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yammy-light-blue/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-yammy-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
              <p className="text-gray-600">Get immediate access to agent pricing and resources after registration.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yammy-light-blue/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-yammy-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Our Network</h3>
              <p className="text-gray-600">Become part of our growing network of agents listed on our website.</p>
            </div>
          </div>

          <div
            id="register"
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 max-w-5xl mx-auto"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="register" disabled={isRegistered}>
                  Register
                </TabsTrigger>
                <TabsTrigger value="pricing">Agent Pricing</TabsTrigger>
              </TabsList>
              <TabsContent value="register" className="p-6">
                {isRegistered ? (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800">Already Registered</h3>
                    <p className="text-green-700 mt-1">
                      You are already registered as an agent. View the pricing tab for exclusive agent pricing.
                    </p>
                    <Button
                      onClick={() => setActiveTab("pricing")}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      View Pricing
                    </Button>
                  </div>
                ) : (
                  <RegistrationForm onRegistrationComplete={handleRegistrationComplete} />
                )}
              </TabsContent>
              <TabsContent value="pricing" className="p-6">
                <AgentPricing showFullPricing={isRegistered} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold text-yammy-dark-blue mb-4">Already an Agent?</h2>
            <p className="text-gray-600 mb-6">
              View our complete list of authorized Yammy Yami agents across Tanzania.
            </p>
            <Button
              onClick={() => (window.location.href = "/agents-list")}
              className="bg-yammy-orange hover:bg-yammy-orange/90 text-white"
            >
              View Agent Directory <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

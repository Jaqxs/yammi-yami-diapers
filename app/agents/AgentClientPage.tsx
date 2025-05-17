"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageWrapper } from "@/components/page-wrapper"
import { RegistrationForm } from "@/components/registration-form"
import { AgentPricing } from "@/components/agent-pricing"
import { useRegistrationStore } from "@/lib/registration-store"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, FileText, Users } from "lucide-react"

export default function AgentClientPage() {
  const { status, email } = useRegistrationStore()
  const [activeTab, setActiveTab] = useState("register")
  const [hasRegistered, setHasRegistered] = useState(false)

  // Check if user is already registered and switch to pricing tab
  useEffect(() => {
    if (status === "approved") {
      setHasRegistered(true)
      setActiveTab("pricing")
    }
  }, [status])

  // Add a function to handle registration completion
  const handleRegistrationComplete = () => {
    setHasRegistered(true)
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
              <h3 className="text-xl font-semibold mb-2">Instant Approval</h3>
              <p className="text-gray-600">
                Get approved quickly and gain immediate access to agent pricing and resources.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yammy-light-blue/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-yammy-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Our Network</h3>
              <p className="text-gray-600">Become part of our growing network of agents listed on our website.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="register" disabled={hasRegistered}>
                  Register
                </TabsTrigger>
                <TabsTrigger value="pricing">Agent Pricing</TabsTrigger>
              </TabsList>
              <TabsContent value="register" className="p-6">
                <RegistrationForm onRegistrationComplete={handleRegistrationComplete} />
              </TabsContent>
              <TabsContent value="pricing" className="p-6">
                <AgentPricing />
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

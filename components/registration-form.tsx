"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import { trackAgentRegistration } from "@/components/google-analytics"

interface RegistrationFormProps {
  onRegistrationComplete?: () => void
}

export function RegistrationForm({ onRegistrationComplete }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    businessAddress: "",
    region: "",
    district: "",
    businessType: "",
    additionalInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      try {
        // Store registration data in localStorage
        const registrationData = {
          ...formData,
          registrationDate: new Date().toISOString(),
          isRegistered: true,
        }

        localStorage.setItem("yammy-current-user", JSON.stringify(registrationData))

        // Mark registration as successful
        setIsSuccess(true)
        setIsSubmitting(false)

        // Call the completion handler if provided
        if (onRegistrationComplete) {
          onRegistrationComplete()
        }

        // Track agent registration
        trackAgentRegistration()
      } catch (error) {
        console.error("Error saving registration:", error)
        setIsSubmitting(false)
      }
    }, 1000)
  }

  if (isSuccess) {
    return (
      <Card className="bg-green-50 border-green-100">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Registration Successful!</h3>
          <p className="text-green-700 mb-4">
            Thank you for registering as a Yammy Yami agent. You now have access to exclusive agent pricing.
          </p>
          <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
            View Agent Pricing
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+255 XXX XXX XXX"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Your business name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessAddress">Business Address *</Label>
        <Input
          id="businessAddress"
          name="businessAddress"
          value={formData.businessAddress}
          onChange={handleChange}
          placeholder="Street address"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="region">Region *</Label>
          <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)} required>
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dar-es-salaam">Dar es Salaam</SelectItem>
              <SelectItem value="arusha">Arusha</SelectItem>
              <SelectItem value="mwanza">Mwanza</SelectItem>
              <SelectItem value="zanzibar">Zanzibar</SelectItem>
              <SelectItem value="dodoma">Dodoma</SelectItem>
              <SelectItem value="mbeya">Mbeya</SelectItem>
              <SelectItem value="tanga">Tanga</SelectItem>
              <SelectItem value="morogoro">Morogoro</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">District *</Label>
          <Input
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="Your district"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessType">Business Type *</Label>
        <Select
          value={formData.businessType}
          onValueChange={(value) => handleSelectChange("businessType", value)}
          required
        >
          <SelectTrigger id="businessType">
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="retail">Retail Shop</SelectItem>
            <SelectItem value="wholesale">Wholesale</SelectItem>
            <SelectItem value="pharmacy">Pharmacy</SelectItem>
            <SelectItem value="supermarket">Supermarket</SelectItem>
            <SelectItem value="distributor">Distributor</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          placeholder="Any additional information about your business"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full bg-yammy-blue hover:bg-yammy-blue/90" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register & View Pricing"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By registering, you agree to our terms and conditions and privacy policy.
      </p>
    </form>
  )
}

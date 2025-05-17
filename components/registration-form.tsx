"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRegistrationStore } from "@/lib/registration-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { useStore } from "@/lib/store"
import { toast } from "@/components/ui/use-toast"

const regions = [
  "Arusha",
  "Dar es Salaam",
  "Dodoma",
  "Geita",
  "Iringa",
  "Kagera",
  "Katavi",
  "Kigoma",
  "Kilimanjaro",
  "Lindi",
  "Manyara",
  "Mara",
  "Mbeya",
  "Morogoro",
  "Mtwara",
  "Mwanza",
  "Njombe",
  "Pemba North",
  "Pemba South",
  "Pwani",
  "Rukwa",
  "Ruvuma",
  "Shinyanga",
  "Simiyu",
  "Singida",
  "Songwe",
  "Tabora",
  "Tanga",
  "Zanzibar Central/South",
  "Zanzibar North",
  "Zanzibar Urban/West",
]

interface RegistrationFormProps {
  onRegistrationComplete?: () => void
}

export function RegistrationForm({ onRegistrationComplete }: RegistrationFormProps) {
  const { setRegistrationInfo, status, email, checkRegistrationStatus } = useRegistrationStore()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    location: "",
    paymentConfirmation: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(status)

  // Import the useStore hook
  const { addRegistration, addAgent } = useStore()

  // Check for status updates
  useEffect(() => {
    if (email) {
      const updatedStatus = checkRegistrationStatus(email)
      setCurrentStatus(updatedStatus)
    } else {
      setCurrentStatus(status)
    }
  }, [status, email, checkRegistrationStatus])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, region: value }))
    if (errors.region) {
      setErrors((prev) => ({ ...prev, region: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10,12}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number is invalid"
    }

    if (!formData.region) newErrors.region = "Region is required"
    if (!formData.location) newErrors.location = "Location is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Update the handleSubmit function to use the store's addRegistration function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Add the registration to the store with immediate approval
      const newRegistration = await addRegistration({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        paymentReference: formData.paymentConfirmation,
        region: formData.region,
        location: formData.location,
        notes: `Region: ${formData.region}, Location: ${formData.location}`,
        status: "approved", // Set status to approved immediately
      })

      console.log("Registration submitted:", newRegistration)

      // Save registration info in the registration store with approved status
      setRegistrationInfo({
        ...formData,
        status: "approved", // Set status to approved immediately
      })

      // Add the user to the agents list immediately
      await addToAgentsList(formData)

      // Update local status
      setCurrentStatus("approved")

      // Call the completion handler if provided
      if (onRegistrationComplete) {
        onRegistrationComplete()
      }

      // Show success message
      toast({
        title: "Registration successful!",
        description: "You now have full access to agent pricing and resources.",
        variant: "default",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        region: "",
        location: "",
        paymentConfirmation: "",
      })
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to add the user to the agents list
  const addToAgentsList = async (userData: typeof formData) => {
    try {
      // Add the user as an agent
      await addAgent({
        name: userData.name,
        location: userData.location,
        phone: userData.phone,
        region: userData.region,
        registrationDate: new Date().toISOString(),
        status: "active",
        tier: "bronze", // Default tier
        salesVolume: 0,
        lastOrderDate: new Date().toISOString(),
      })

      // Also update the agents list in localStorage
      const agentsJSON = localStorage.getItem("yammy-agents") || "[]"
      const agents = JSON.parse(agentsJSON)

      const newAgent = {
        id: agents.length > 0 ? Math.max(...agents.map((a: any) => a.id)) + 1 : 1,
        name: userData.name,
        location: userData.location,
        phone: userData.phone,
        region: userData.region,
        registrationDate: new Date().toISOString(),
        status: "active",
        tier: "bronze",
        salesVolume: 0,
        lastOrderDate: new Date().toISOString(),
      }

      agents.push(newAgent)
      localStorage.setItem("yammy-agents", JSON.stringify(agents))

      console.log("User added to agents list:", newAgent)
    } catch (error) {
      console.error("Error adding user to agents list:", error)
      throw error
    }
  }

  if (currentStatus === "approved") {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800">Registration Approved</AlertTitle>
        <AlertDescription className="text-green-700">
          Your registration has been approved. You now have full access to agent pricing and resources.
        </AlertDescription>
      </Alert>
    )
  }

  if (currentStatus === "pending") {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <Clock className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Registration Pending</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Your registration is being reviewed. We'll notify you at {email} once it's approved. This typically takes 1-2
          business days.
        </AlertDescription>
      </Alert>
    )
  }

  if (currentStatus === "rejected") {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <AlertTitle className="text-red-800">Registration Rejected</AlertTitle>
        <AlertDescription className="text-red-700">
          Unfortunately, your registration was not approved. Please contact our support team at support@yammyyami.com
          for more information.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agent Registration</CardTitle>
        <CardDescription>
          Register as an agent to access exclusive pricing and resources - Registration is free!
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business/Shop Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your business or shop name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select value={formData.region} onValueChange={handleSelectChange}>
              <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.region && <p className="text-red-500 text-sm">{errors.region}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location/Area</Label>
            <Input
              id="location"
              name="location"
              placeholder="Your specific location or area"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentConfirmation">
              Payment Reference (Optional)
              <span className="block text-sm text-gray-500 font-normal mt-1">
                If you've made any payment, please provide your M-Pesa or bank transfer confirmation number
              </span>
            </Label>
            <Textarea
              id="paymentConfirmation"
              name="paymentConfirmation"
              placeholder="Enter payment confirmation number (optional)"
              value={formData.paymentConfirmation}
              onChange={handleChange}
            />
          </div>

          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Processing..." : "Register & View Pricing"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

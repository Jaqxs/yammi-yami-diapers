"use client"

import type React from "react"

import { useState } from "react"
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

export function RegistrationForm() {
  const { setRegistrationInfo, status, email } = useRegistrationStore()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    paymentConfirmation: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Import the useStore hook
  const { addRegistration } = useStore()

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
    if (!formData.paymentConfirmation.trim()) newErrors.paymentConfirmation = "Payment confirmation is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Update the handleSubmit function to use the store's addRegistration function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Add the registration to the store
      await addRegistration({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        paymentReference: formData.paymentConfirmation,
        notes: `Region: ${formData.region}`,
      })

      // Save registration info in the registration store
      setRegistrationInfo(formData)

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        region: "",
        paymentConfirmation: "",
      })

      toast({
        title: "Registration submitted",
        description: "Your registration has been submitted successfully. We'll review it shortly.",
      })
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "approved") {
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

  if (status === "pending") {
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

  if (status === "rejected") {
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
        <CardDescription>Register as an agent to access exclusive pricing and resources</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your full name"
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
            <Label htmlFor="paymentConfirmation">
              Payment Confirmation
              <span className="block text-sm text-gray-500 font-normal mt-1">
                Please provide your M-Pesa or bank transfer confirmation number for the registration fee of TZS 50,000
              </span>
            </Label>
            <Textarea
              id="paymentConfirmation"
              name="paymentConfirmation"
              placeholder="Enter payment confirmation number"
              value={formData.paymentConfirmation}
              onChange={handleChange}
              className={errors.paymentConfirmation ? "border-red-500" : ""}
            />
            {errors.paymentConfirmation && <p className="text-red-500 text-sm">{errors.paymentConfirmation}</p>}
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
            {isSubmitting ? "Submitting..." : "Register as Agent"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

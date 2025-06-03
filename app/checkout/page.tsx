"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"

const translations = {
  en: {
    checkout: "Checkout",
    contactInfo: "Contact Information",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone Number",
    shippingInfo: "Shipping Information",
    address: "Address",
    city: "City",
    region: "Region",
    additionalInfo: "Additional Information",
    notes: "Order Notes (Optional)",
    orderSummary: "Order Summary",
    items: "Items",
    total: "Total",
    placeOrder: "Place Order via WhatsApp",
    continueShopping: "Continue Shopping",
    emptyCart: "Your cart is empty",
    startShopping: "Start Shopping",
    quantity: "Quantity",
    size: "Size",
    bundleSize: "Bundle Size",
    pieces: "pieces",
    required: "This field is required",
    invalidPhone: "Please enter a valid phone number",
    invalidEmail: "Please enter a valid email address",
    orderSuccess: "Order Submitted Successfully",
    orderSuccessMessage: "Your order has been sent to WhatsApp. Please complete the payment process there.",
    darEsSalaam: "Dar es Salaam",
    arusha: "Arusha",
    mwanza: "Mwanza",
    dodoma: "Dodoma",
    tanga: "Tanga",
    mbeya: "Mbeya",
    morogoro: "Morogoro",
    zanzibar: "Zanzibar",
    kigoma: "Kigoma",
    selectRegion: "Select Region",
  },
  sw: {
    checkout: "Malipo",
    contactInfo: "Taarifa za Mawasiliano",
    firstName: "Jina la Kwanza",
    lastName: "Jina la Familia",
    email: "Barua Pepe",
    phone: "Namba ya Simu",
    shippingInfo: "Taarifa za Usafirishaji",
    address: "Anwani",
    city: "Mji",
    region: "Mkoa",
    additionalInfo: "Taarifa za Ziada",
    notes: "Maelezo ya Oda (Hiari)",
    orderSummary: "Muhtasari wa Oda",
    items: "Bidhaa",
    total: "Jumla",
    placeOrder: "Weka Oda kupitia WhatsApp",
    continueShopping: "Endelea na Ununuzi",
    emptyCart: "Kikapu chako ni tupu",
    startShopping: "Anza Ununuzi",
    quantity: "Idadi",
    size: "Ukubwa",
    bundleSize: "Ukubwa wa Kifurushi",
    pieces: "vipande",
    required: "Sehemu hii inahitajika",
    invalidPhone: "Tafadhali ingiza namba ya simu sahihi",
    invalidEmail: "Tafadhali ingiza anwani ya barua pepe sahihi",
    orderSuccess: "Oda Imetumwa kwa Mafanikio",
    orderSuccessMessage: "Oda yako imetumwa kwenye WhatsApp. Tafadhali kamilisha mchakato wa malipo huko.",
    darEsSalaam: "Dar es Salaam",
    arusha: "Arusha",
    mwanza: "Mwanza",
    dodoma: "Dodoma",
    tanga: "Tanga",
    mbeya: "Mbeya",
    morogoro: "Morogoro",
    zanzibar: "Zanzibar",
    kigoma: "Kigoma",
    selectRegion: "Chagua Mkoa",
  },
}

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  notes: string
}

type FormErrors = {
  [key in keyof FormData]?: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { language } = useLanguage()
  const router = useRouter()
  const t = translations[language]

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    notes: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const formatPrice = (price: number) => {
    return `TZS ${price.toLocaleString()}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user selects
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields
    const requiredFields: (keyof FormData)[] = ["firstName", "lastName", "phone", "address", "city", "region"]
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = t.required
      }
    })

    // Phone validation
    if (formData.phone && !/^[0-9+\s]{10,15}$/.test(formData.phone)) {
      newErrors.phone = t.invalidPhone
    }

    // Email validation (only if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.invalidEmail
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Format order details for WhatsApp
    const orderItems = items
      .map((item) => `${item.name[language]} (${item.quantity}x) - ${formatPrice(item.price * item.quantity)}`)
      .join("\n")

    const orderDetails = `
*NEW ORDER FROM WEBSITE*

*Contact Information:*
Name: ${formData.firstName} ${formData.lastName}
Phone: ${formData.phone}
${formData.email ? `Email: ${formData.email}` : ""}

*Shipping Information:*
Address: ${formData.address}
City: ${formData.city}
Region: ${formData.region}
${formData.notes ? `\nNotes: ${formData.notes}` : ""}

*Order Summary:*
${orderItems}

*Total: ${formatPrice(total)}*
`

    // Create WhatsApp link with order details
    const whatsappUrl = `https://wa.me/255773181863?text=${encodeURIComponent(orderDetails)}`

    // Set success state and clear cart
    setIsSuccess(true)
    clearCart()

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")

    setIsSubmitting(false)
  }

  const handleContinueShopping = () => {
    router.push("/products")
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="text-center">
              <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl font-bubblegum text-yammy-dark-blue mb-2">{t.checkout}</h1>
              <p className="text-gray-500 mb-4">{t.emptyCart}</p>
            </div>
            <Button onClick={handleContinueShopping} className="bg-yammy-blue hover:bg-yammy-dark-blue">
              {t.startShopping}
            </Button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (isSuccess) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bubblegum text-yammy-dark-blue mb-2">{t.orderSuccess}</h1>
              <p className="text-gray-600">{t.orderSuccessMessage}</p>
            </div>
            <Button onClick={handleContinueShopping} className="w-full bg-yammy-blue hover:bg-yammy-dark-blue">
              {t.continueShopping}
            </Button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bubblegum text-yammy-dark-blue mb-8 text-center">{t.checkout}</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bubblegum text-yammy-dark-blue mb-4">{t.contactInfo}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      {t.firstName} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      {t.lastName} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t.email}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {t.phone} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bubblegum text-yammy-dark-blue mb-4">{t.shippingInfo}</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      {t.address} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        {t.city} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">
                        {t.region} <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)}>
                        <SelectTrigger id="region" className={errors.region ? "border-red-500" : ""}>
                          <SelectValue placeholder={t.selectRegion} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dar-es-salaam">{t.darEsSalaam}</SelectItem>
                          <SelectItem value="arusha">{t.arusha}</SelectItem>
                          <SelectItem value="mwanza">{t.mwanza}</SelectItem>
                          <SelectItem value="dodoma">{t.dodoma}</SelectItem>
                          <SelectItem value="tanga">{t.tanga}</SelectItem>
                          <SelectItem value="mbeya">{t.mbeya}</SelectItem>
                          <SelectItem value="morogoro">{t.morogoro}</SelectItem>
                          <SelectItem value="zanzibar">{t.zanzibar}</SelectItem>
                          <SelectItem value="kigoma">{t.kigoma}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.region && <p className="text-red-500 text-xs">{errors.region}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bubblegum text-yammy-dark-blue mb-4">{t.additionalInfo}</h2>
                <div className="space-y-2">
                  <Label htmlFor="notes">{t.notes}</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-yammy-blue hover:bg-yammy-dark-blue" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : t.placeOrder}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-bubblegum text-yammy-dark-blue mb-4">{t.orderSummary}</h2>

              <div className="space-y-4">
                <div className="max-h-[400px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 py-3 border-b border-gray-100">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-yammy-light-blue">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name[language]}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name[language]} <span className="text-gray-500">x{item.quantity}</span>
                        </h4>
                        {item.size && (
                          <p className="text-xs text-gray-500">
                            {t.size}: {t[item.size as keyof typeof t]}
                          </p>
                        )}
                        <p className="text-sm font-medium text-yammy-blue">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between text-base font-medium">
                  <p>{t.total}</p>
                  <p className="text-yammy-blue font-bold">{formatPrice(total)}</p>
                </div>

                <Alert className="bg-yammy-light-blue border-yammy-blue">
                  <AlertCircle className="h-4 w-4 text-yammy-blue" />
                  <AlertTitle className="text-yammy-dark-blue">
                    {language === "en" ? "Order via WhatsApp" : "Agiza kupitia WhatsApp"}
                  </AlertTitle>
                  <AlertDescription className="text-gray-600 text-sm">
                    {language === "en"
                      ? "After placing your order, you'll be redirected to WhatsApp to complete payment and delivery arrangements."
                      : "Baada ya kuweka oda yako, utaelekezwa kwenye WhatsApp kukamilisha malipo na mpangilio wa usafirishaji."}
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

// Fallback icon in case of import issues
function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

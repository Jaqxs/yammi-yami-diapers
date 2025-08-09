"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, CreditCard, MapPin, User, Package, Truck } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { useRealtime } from "@/lib/realtime-store"
import { PageWrapper } from "@/components/page-wrapper"

const translations = {
  en: {
    checkout: "Checkout",
    orderSummary: "Order Summary",
    customerInfo: "Customer Information",
    deliveryInfo: "Delivery Information",
    paymentMethod: "Payment Method",
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    address: "Delivery Address",
    city: "City",
    region: "Region",
    notes: "Special Instructions",
    cashOnDelivery: "Cash on Delivery",
    mobileMoney: "Mobile Money",
    bankTransfer: "Bank Transfer",
    placeOrder: "Place Order",
    processing: "Processing Order...",
    total: "Total",
    subtotal: "Subtotal",
    delivery: "Delivery Fee",
    orderSuccess: "Order Placed Successfully!",
    orderError: "Failed to place order. Please try again.",
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    invalidPhone: "Please enter a valid phone number",
  },
  sw: {
    checkout: "Malipo",
    orderSummary: "Muhtasari wa Oda",
    customerInfo: "Taarifa za Mteja",
    deliveryInfo: "Taarifa za Uwasilishaji",
    paymentMethod: "Njia ya Malipo",
    fullName: "Jina Kamili",
    email: "Barua Pepe",
    phone: "Nambari ya Simu",
    address: "Anwani ya Uwasilishaji",
    city: "Jiji",
    region: "Mkoa",
    notes: "Maelezo Maalum",
    cashOnDelivery: "Malipo Wakati wa Uwasilishaji",
    mobileMoney: "Pesa za Simu",
    bankTransfer: "Uhamisho wa Benki",
    placeOrder: "Weka Oda",
    processing: "Inachakata Oda...",
    total: "Jumla",
    subtotal: "Jumla Ndogo",
    delivery: "Ada ya Uwasilishaji",
    orderSuccess: "Oda Imewekwa Kwa Mafanikio!",
    orderError: "Imeshindwa kuweka oda. Tafadhali jaribu tena.",
    required: "Sehemu hii inahitajika",
    invalidEmail: "Tafadhali ingiza barua pepe sahihi",
    invalidPhone: "Tafadhali ingiza nambari ya simu sahihi",
  },
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const { language } = useLanguage()
  const { createOrder } = useRealtime()
  const { toast } = useToast()
  const router = useRouter()
  const t = translations[language]

  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    city: "",
    region: "",
    paymentMethod: "cash_on_delivery",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const deliveryFee = 5000 // TZS 5,000 delivery fee
  const subtotal = getTotalPrice()
  const total = subtotal + deliveryFee

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = t.required
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = t.required
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = t.invalidEmail
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = t.required
    } else if (!/^(\+255|0)[67]\d{8}$/.test(formData.customerPhone.replace(/\s/g, ""))) {
      newErrors.customerPhone = t.invalidPhone
    }

    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = t.required
    }

    if (!formData.city.trim()) {
      newErrors.city = t.required
    }

    if (!formData.region.trim()) {
      newErrors.region = t.required
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Create order in real-time database
      const order = await createOrder({
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        customer_address: `${formData.customerAddress}, ${formData.city}, ${formData.region}`,
        total_amount: total,
        status: "pending",
        payment_status: "pending",
        notes: formData.notes || undefined,
      })

      if (order) {
        // Create order items (you would need to create this API endpoint)
        const orderItems = items.map((item) => ({
          order_id: order.id,
          product_id: item.id.toString(),
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        }))

        // Insert order items
        await fetch("/api/admin/supabase/order-items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderItems }),
        })

        // Clear cart and show success
        clearCart()

        toast({
          title: t.orderSuccess,
          description: `Order #${order.id.slice(0, 8)} has been placed successfully.`,
          duration: 5000,
        })

        // Redirect to success page or order confirmation
        router.push(`/order-confirmation/${order.id}`)
      } else {
        throw new Error("Failed to create order")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: t.orderError,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (items.length === 0) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some products to your cart before checking out.</p>
            <Button asChild className="bg-yammy-blue hover:bg-yammy-dark-blue">
              <a href="/products">Continue Shopping</a>
            </Button>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-yammy-dark-blue mb-8 text-center">{t.checkout}</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Form */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t.customerInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="customerName">{t.fullName} *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      className={errors.customerName ? "border-red-500" : ""}
                    />
                    {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">{t.email} *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                      className={errors.customerEmail ? "border-red-500" : ""}
                    />
                    {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="customerPhone">{t.phone} *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                    placeholder="+255 7XX XXX XXX"
                    className={errors.customerPhone ? "border-red-500" : ""}
                  />
                  {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t.deliveryInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customerAddress">{t.address} *</Label>
                  <Textarea
                    id="customerAddress"
                    value={formData.customerAddress}
                    onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                    className={errors.customerAddress ? "border-red-500" : ""}
                    rows={3}
                  />
                  {errors.customerAddress && <p className="text-red-500 text-sm mt-1">{errors.customerAddress}</p>}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="city">{t.city} *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Label htmlFor="region">{t.region} *</Label>
                    <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                      <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dar-es-salaam">Dar es Salaam</SelectItem>
                        <SelectItem value="arusha">Arusha</SelectItem>
                        <SelectItem value="dodoma">Dodoma</SelectItem>
                        <SelectItem value="mwanza">Mwanza</SelectItem>
                        <SelectItem value="tanga">Tanga</SelectItem>
                        <SelectItem value="morogoro">Morogoro</SelectItem>
                        <SelectItem value="mbeya">Mbeya</SelectItem>
                        <SelectItem value="iringa">Iringa</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">{t.notes}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={2}
                    placeholder="Any special delivery instructions..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t.paymentMethod}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange("paymentMethod", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash_on_delivery">{t.cashOnDelivery}</SelectItem>
                    <SelectItem value="mobile_money">{t.mobileMoney}</SelectItem>
                    <SelectItem value="bank_transfer">{t.bankTransfer}</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {t.orderSummary}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name[language]}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name[language]}</h4>
                        <p className="text-xs text-gray-500">
                          {item.size && `Size: ${item.size}`} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t.subtotal}:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      {t.delivery}:
                    </span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t.total}:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full bg-yammy-blue hover:bg-yammy-dark-blue"
                  size="lg"
                >
                  {isProcessing ? t.processing : t.placeOrder}
                </Button>

                {/* Payment Method Badge */}
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {formData.paymentMethod === "cash_on_delivery" && t.cashOnDelivery}
                    {formData.paymentMethod === "mobile_money" && t.mobileMoney}
                    {formData.paymentMethod === "bank_transfer" && t.bankTransfer}
                  </Badge>
                </div>
              </CardContent>
            </Card>
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

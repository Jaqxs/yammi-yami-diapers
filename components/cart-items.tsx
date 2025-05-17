"use client"

import type React from "react"
import Image from "next/image"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-provider"
import { useLanguage } from "./language-provider"
import { useRouter } from "next/navigation"

const translations = {
  en: {
    emptyCart: "Your cart is empty",
    startShopping: "Start Shopping",
    total: "Total",
    checkout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    quantity: "Quantity",
    size: "Size",
    bundleSize: "Bundle Size",
    pieces: "pieces",
    small: "Small",
    medium: "Medium",
    large: "Large",
    extraLarge: "Extra Large",
  },
  sw: {
    emptyCart: "Kikapu chako ni tupu",
    startShopping: "Anza Ununuzi",
    total: "Jumla",
    checkout: "Endelea na Malipo",
    continueShopping: "Endelea na Ununuzi",
    quantity: "Idadi",
    size: "Ukubwa",
    bundleSize: "Ukubwa wa Kifurushi",
    pieces: "vipande",
    small: "Ndogo",
    medium: "Wastani",
    large: "Kubwa",
    extraLarge: "Kubwa Zaidi",
  },
}

export function CartItems() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { language } = useLanguage()
  const router = useRouter()
  const t = translations[language]

  const formatPrice = (price: number) => {
    return `TZS ${price.toLocaleString()}`
  }

  const handleCheckout = () => {
    // Direct navigation to checkout without any confirmation
    router.push("/checkout")
  }

  const handleContinueShopping = () => {
    router.push("/products")
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="text-center">
          <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">{t.emptyCart}</p>
        </div>
        <Button onClick={handleContinueShopping} className="bg-yammy-blue hover:bg-yammy-dark-blue">
          {t.startShopping}
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="py-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-yammy-light-blue">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name[language]}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{item.name[language]}</h4>
                  {item.size && (
                    <p className="text-xs text-gray-500">
                      {t.size}: {t[item.size as keyof typeof t]}
                    </p>
                  )}
                  {item.bundleSize && (
                    <p className="text-xs text-gray-500">
                      {t.bundleSize}: {item.bundleSize} {t.pieces}
                    </p>
                  )}
                  <p className="text-sm font-medium text-yammy-blue">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full p-0 border-yammy-blue/30"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full p-0 border-yammy-blue/30"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
          <p>{t.total}</p>
          <p>{formatPrice(total)}</p>
        </div>
        <div className="space-y-2">
          <Button className="w-full bg-yammy-blue hover:bg-yammy-dark-blue" onClick={handleCheckout}>
            {t.checkout}
          </Button>
          <Button
            variant="outline"
            className="w-full border-yammy-blue/30 text-yammy-blue hover:bg-yammy-blue/10"
            onClick={handleContinueShopping}
          >
            {t.continueShopping}
          </Button>
        </div>
      </div>
    </div>
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

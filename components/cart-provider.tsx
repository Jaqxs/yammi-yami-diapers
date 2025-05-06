"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useLanguage } from "./language-provider"
import { useToast } from "@/components/ui/use-toast"

export type CartItem = {
  id: number
  name: {
    en: string
    sw: string
  }
  price: number
  quantity: number
  image: string
  size?: string
  bundleSize?: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const translations = {
  en: {
    addedToCart: "Added to cart",
    itemsInCart: "items in cart",
    quantity: "Quantity",
  },
  sw: {
    addedToCart: "Imeongezwa kwenye kikapu",
    itemsInCart: "bidhaa kwenye kikapu",
    quantity: "Idadi",
  },
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [total, setTotal] = useState(0)
  const { language } = useLanguage()
  const { toast } = useToast()
  const t = translations[language]

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("yammy-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("yammy-cart", JSON.stringify(items))
    } else {
      localStorage.removeItem("yammy-cart")
    }

    // Calculate totals
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    setItemCount(count)
    setTotal(cartTotal)
  }, [items])

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id)
      let updatedItems

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
      } else {
        // Add new item to cart
        updatedItems = [...prevItems, newItem]
      }

      // Show toast notification
      toast({
        title: t.addedToCart,
        description: (
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded overflow-hidden">
              <img
                src={newItem.image || "/placeholder.svg?height=40&width=40&query=product"}
                alt={newItem.name[language]}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = "/diverse-products-still-life.png"
                }}
              />
            </div>
            <div>
              <p className="font-medium">{newItem.name[language]}</p>
              <p className="text-sm text-gray-500">
                {t.quantity}: {newItem.quantity}
              </p>
            </div>
          </div>
        ),
        className: "bg-white border-yammy-blue",
      })

      return updatedItems
    })
  }

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("yammy-cart")
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

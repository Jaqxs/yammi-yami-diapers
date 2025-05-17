"use client"

import { useCart } from "./cart-provider"

export function CartDebug() {
  const { isOpen, openCart, closeCart, items } = useCart()

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>Cart open: {isOpen ? "Yes" : "No"}</div>
      <div>Items: {items.length}</div>
      <div className="flex gap-2 mt-1">
        <button onClick={openCart} className="bg-green-600 px-2 py-1 rounded">
          Open
        </button>
        <button onClick={closeCart} className="bg-red-600 px-2 py-1 rounded">
          Close
        </button>
      </div>
    </div>
  )
}

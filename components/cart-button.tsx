"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-provider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "./language-provider"
import { CartItems } from "./cart-items"
import { Badge } from "@/components/ui/badge"

const translations = {
  en: {
    cart: "Cart",
    yourCart: "Your Cart",
  },
  sw: {
    cart: "Kikapu",
    yourCart: "Kikapu Chako",
  },
}

export function CartButton() {
  const { itemCount } = useCart()
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-yammy-blue/30 text-yammy-blue">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-yammy-orange text-white">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-bubblegum text-yammy-dark-blue text-2xl">{t.yourCart}</SheetTitle>
        </SheetHeader>
        <CartItems />
      </SheetContent>
    </Sheet>
  )
}

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"
import { CartProvider } from "@/components/cart-provider"
import { StoreProvider } from "@/lib/store"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Yammy Yami Diaper TZ",
  description: "Quality diapers for every family member. Love Your Baby, Love Your Family.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <LanguageProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </LanguageProvider>
        </StoreProvider>
      </body>
    </html>
  )
}

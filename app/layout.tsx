import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LanguageProvider } from "@/components/language-provider"
import { CartProvider } from "@/components/cart-provider"
import { RealtimeProvider } from "@/lib/realtime-store"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Yammy Yami Diapers - Premium Baby Care Products",
  description: "High-quality, affordable diapers and baby care products in Tanzania",
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
        <LanguageProvider>
          <CartProvider>
            <RealtimeProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </RealtimeProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/components/language-provider"
import { CartProvider } from "@/components/cart-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Yammy Yami Diapers",
  description: "Quality diapers for every family member",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

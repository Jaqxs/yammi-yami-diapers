import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"
import { LanguageProvider } from "@/components/language-provider"
import { StoreProvider } from "@/lib/store"
import { StoreSyncProvider } from "@/lib/store-sync"
import { RegistrationSync } from "@/lib/registration-sync"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Yammy Yami Diapers",
  description: "Premium quality diapers for babies and adults",
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
        <ThemeProvider attribute="class" defaultTheme="light">
          <StoreProvider>
            <StoreSyncProvider>
              <LanguageProvider>
                <CartProvider>
                  <RegistrationSync />
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                  </div>
                  <Toaster />
                </CartProvider>
              </LanguageProvider>
            </StoreSyncProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

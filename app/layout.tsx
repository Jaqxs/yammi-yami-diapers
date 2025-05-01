import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter, Nunito } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"
import { LanguageProvider } from "@/components/language-provider"
import { StoreProvider } from "@/lib/store"
import { StoreSyncProvider } from "@/lib/store-sync"
import { RegistrationSync } from "@/lib/registration-sync"
import { Toaster } from "@/components/ui/toaster"

// Load fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
})

// Define metadata
export const metadata: Metadata = {
  title: "Yammy Yami Diapers",
  description: "Premium quality diapers for babies and adults",
  applicationName: "Yammy Yami Diaper TZ",
  keywords: ["diapers", "baby products", "Tanzania", "Yammy Yami"],
  authors: [{ name: "Yammy Yami Diaper TZ" }],
  creator: "Yammy Yami Diaper TZ",
    generator: 'v0.dev'
}

// Define viewport settings
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#00AEEF" },
    { media: "(prefers-color-scheme: dark)", color: "#00AEEF" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
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

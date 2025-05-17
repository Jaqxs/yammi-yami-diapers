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
import { cn } from "@/lib/utils"
import { ImagePreloader } from "@/components/image-preloader"

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

// Critical images to preload
const criticalImages = [
  "/images/yammy-yami-mother-daughter-hero.jpeg",
  "/images/brand-ambassador-1.jpeg",
  "/images/brand-ambassador-2.jpeg",
  "/blog-post-concept.png",
  "/images/baby-diapers.png",
  "/images/lady-pads.png",
  "/images/diaper-features.png",
  "/images/diaper-sizes.png",
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("no-horizontal-overflow", inter.variable, nunito.variable)}>
      <body className={cn("min-h-screen no-horizontal-overflow", inter.className)}>
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
                  {/* Preload critical images */}
                  <ImagePreloader images={criticalImages} />
                </CartProvider>
              </LanguageProvider>
            </StoreSyncProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

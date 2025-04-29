import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { StoreProvider } from "@/lib/store"
import { LanguageProvider } from "@/components/language-provider"
import { CartProvider } from "@/components/cart-provider"
import { StoreSyncProvider } from "@/lib/store-sync"
import { AdminChangeNotification } from "@/components/admin-change-notification"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Yammy Yami Diaper TZ",
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
        <StoreProvider>
          <StoreSyncProvider>
            <LanguageProvider>
              <CartProvider>
                {children}
                <Toaster />
                <AdminChangeNotification />
              </CartProvider>
            </LanguageProvider>
          </StoreSyncProvider>
        </StoreProvider>
      </body>
    </html>
  )
}

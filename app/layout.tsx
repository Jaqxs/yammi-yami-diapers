import type React from "react"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { CartProvider } from "@/components/cart-provider"
import { StoreSyncProvider } from "@/lib/store-sync"
import { StoreProvider } from "@/lib/store"
import { RegistrationSync } from "@/lib/registration-sync"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <StoreProvider>
              <StoreSyncProvider>
                <CartProvider>
                  <RegistrationSync />
                  <Navbar />
                  <main>{children}</main>
                  <Footer />
                </CartProvider>
              </StoreSyncProvider>
            </StoreProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };

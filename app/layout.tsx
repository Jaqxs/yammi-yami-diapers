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
import Script from "next/script"

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
    <html lang="en" className={cn("no-horizontal-overflow", inter.variable, nunito.variable)}>
      <head>
        {/* Add cache-busting meta tags */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
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
                </CartProvider>
              </LanguageProvider>
            </StoreSyncProvider>
          </StoreProvider>
        </ThemeProvider>

        {/* Service worker registration script */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/service-worker.js', { 
                  scope: '/' 
                })
                .then(function(registration) {
                  console.log('Service Worker registered with scope:', registration.scope);
                  
                  // Check for updates every minute
                  setInterval(() => {
                    registration.update();
                  }, 60000);
                })
                .catch(function(error) {
                  console.log('Service Worker registration failed:', error);
                });
                
                // Force reload images when navigating
                let lastPath = window.location.pathname;
                setInterval(() => {
                  if (lastPath !== window.location.pathname) {
                    lastPath = window.location.pathname;
                    
                    // Clear image cache
                    if (navigator.serviceWorker.controller) {
                      navigator.serviceWorker.controller.postMessage({
                        type: 'CLEAR_IMAGE_CACHE'
                      });
                    }
                    
                    // Force reload visible images
                    document.querySelectorAll('img').forEach(img => {
                      const currentSrc = img.src;
                      if (currentSrc) {
                        const url = new URL(currentSrc);
                        url.searchParams.set('t', Date.now().toString());
                        img.src = url.toString();
                      }
                    });
                  }
                }, 300);
              });
              
              // Listen for messages from service worker
              navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'CACHE_CLEARED') {
                  console.log('Image cache cleared');
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}

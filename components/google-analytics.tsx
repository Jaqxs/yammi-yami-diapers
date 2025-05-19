"use client"

import { useEffect } from "react"
import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"

// Your Google Analytics measurement ID
const GA_MEASUREMENT_ID = "G-DWP5DBLY4P"

declare global {
  interface Window {
    gtag: (command: string, action: string, params?: Record<string, any> | undefined) => void
  }
}

// Initialize Google Analytics
export const GoogleAnalytics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && window.gtag) {
      // Track page views
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pathname,
      })
    }
  }, [pathname, searchParams])

  return (
    <>
      {/* Google Analytics Script - Exactly as provided */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  )
}

// Utility functions for tracking events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Predefined event tracking functions
export const trackProductView = (product: { id: string; name: string; category?: string }) => {
  trackEvent("view_item", "Products", product.name, 0)

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "view_item", {
      currency: "TZS",
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category || "Diapers",
        },
      ],
    })
  }
}

export const trackAddToCart = (product: { id: string; name: string; price?: number; quantity?: number }) => {
  trackEvent("add_to_cart", "Ecommerce", product.name, product.price)

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "add_to_cart", {
      currency: "TZS",
      value: product.price || 0,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price || 0,
          quantity: product.quantity || 1,
        },
      ],
    })
  }
}

export const trackCheckout = (products: Array<{ id: string; name: string; price?: number; quantity?: number }>) => {
  const totalValue = products.reduce((sum, product) => sum + (product.price || 0) * (product.quantity || 1), 0)

  trackEvent("begin_checkout", "Ecommerce", "Checkout", totalValue)

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "begin_checkout", {
      currency: "TZS",
      value: totalValue,
      items: products.map((product) => ({
        item_id: product.id,
        item_name: product.name,
        price: product.price || 0,
        quantity: product.quantity || 1,
      })),
    })
  }
}

export const trackAgentRegistration = () => {
  trackEvent("generate_lead", "Agents", "Agent Registration", 0)
}

export const trackBlogView = (title: string) => {
  trackEvent("view_item", "Blog", title, 0)
}

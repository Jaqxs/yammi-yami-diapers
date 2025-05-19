"use client"

import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

// The GA Measurement ID from the user's script
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-DWP5DBLY4P"

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      // Track page views
      window.gtag?.("config", GA_MEASUREMENT_ID, {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      })
    }
  }, [pathname, searchParams])

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <Script
        id="gtag-init"
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

// Helper function to track events
export function trackEvent(action: string, category: string, label: string, value?: number) {
  window.gtag?.("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Helper function to track product views
export function trackProductView(product: { id: number; name: { en: string; sw: string }; category: string }) {
  window.gtag?.("event", "view_item", {
    items: [
      {
        id: product.id,
        name: product.name.en,
        category: product.category,
      },
    ],
  })
}

// Helper function to track add to cart events
export function trackAddToCart(product: {
  id: number
  name: { en: string; sw: string }
  price: number
  quantity: number
}) {
  window.gtag?.("event", "add_to_cart", {
    currency: "TZS",
    value: product.price * product.quantity,
    items: [
      {
        id: product.id,
        name: product.name.en,
        quantity: product.quantity,
        price: product.price,
      },
    ],
  })
}

// Helper function to track blog post views
export function trackBlogView(title: { en: string; sw: string }) {
  window.gtag?.("event", "view_blog_post", {
    blog_post_title: title.en,
  })
}

// Helper function to track agent registrations
export function trackAgentRegistration() {
  window.gtag?.("event", "agent_registration", {
    method: "website",
  })
}

// Helper function to track checkout events
export function trackCheckout(items: any[]) {
  window.gtag?.("event", "begin_checkout", {
    currency: "TZS",
    value: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    items: items.map((item) => ({
      id: item.id,
      name: item.name.en,
      quantity: item.quantity,
      price: item.price,
    })),
  })
}

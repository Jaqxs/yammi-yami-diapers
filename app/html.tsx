import type React from "react"
import { AnalyticsHeadScript } from "@/components/analytics-head-script"

export default function CustomHtml({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <AnalyticsHeadScript />
      </head>
      <body>{children}</body>
    </html>
  )
}

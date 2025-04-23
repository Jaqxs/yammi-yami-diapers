import type { ReactNode } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface PageWrapperProps {
  children: ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen baby-bg-pattern flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

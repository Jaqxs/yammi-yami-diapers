"use client"

import Link from "next/link"
import { siteConfig } from "@/config/site"
import { CartButton } from "./cart-button"
import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type Props = {}

const navigationItems = [
  { name: { en: "Home", sw: "Nyumbani" }, href: "/" },
  { name: { en: "Products", sw: "Bidhaa" }, href: "/products" },
  { name: { en: "About", sw: "Kuhusu" }, href: "/about" },
  { name: { en: "Blog", sw: "Blogu" }, href: "/blog" },
  { name: { en: "Agents", sw: "Wakala" }, href: "/agents" },
  { name: { en: "Agents List", sw: "Orodha ya Wakala" }, href: "/agents-list" },
  { name: { en: "Contact", sw: "Wasiliana" }, href: "/contact" },
]

export function Navbar({}: Props) {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex flex-1 items-center space-x-0">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-yammy-blue flex items-center justify-center text-white font-bold">
              YY
            </div>
            <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
          </Link>
          <nav className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-yammy-blue"
              >
                {item.name[language || "en"]}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <CartButton />
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Toggle Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")} className={cn(language === "en" && "bg-muted")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("sw")} className={cn(language === "sw" && "bg-muted")}>
                Kiswahili
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { CartButton } from "./cart-button"
import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import { Globe, Menu, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-media-query"
import { motion, AnimatePresence } from "framer-motion"

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
  const isMobile = useIsMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [isMobile, isMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMenuOpen])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white",
      )}
    >
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex flex-1 items-center space-x-0">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-yammy-blue flex items-center justify-center text-white font-bold">
              YY
            </div>
            <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
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
          )}
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

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 bg-white z-30 overflow-y-auto pb-6"
          >
            <nav className="container py-6 flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium py-2 border-b border-gray-100 transition-colors hover:text-yammy-blue"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name[language || "en"]}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

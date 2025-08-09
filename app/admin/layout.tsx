"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FileText,
  BarChart,
  Settings,
  LogOut,
  Menu,
  Users,
  ClipboardCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"

// Mock authentication - in a real app, use a proper auth system
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("admin-authenticated") === "true"
      setIsAuthenticated(isLoggedIn)
      setIsLoading(false)
    }

    checkAuth()

    // Add event listener to check auth on storage changes
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const login = (username: string, password: string) => {
    // Mock login - in a real app, validate against a backend
    if (username === "admin" && password === "password") {
      localStorage.setItem("admin-authenticated", "true")
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("admin-authenticated")
    setIsAuthenticated(false)
  }

  return { isAuthenticated, isLoading, login, logout }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading) {
      // Check authentication directly from localStorage for the most up-to-date value
      const isLoggedIn = localStorage.getItem("admin-authenticated") === "true"

      if (!isLoggedIn && pathname !== "/admin/login") {
        router.push("/admin/login")
      } else if (isLoggedIn && pathname === "/admin/login") {
        // If authenticated and on login page, redirect to admin dashboard
        router.push("/admin")
      }
    }
  }, [isLoading, router, pathname])

  // Handle logout
  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin panel",
    })
    router.push("/admin/login")
  }

  // If loading or not authenticated, don't render the layout
  if (isLoading || (!isAuthenticated && pathname !== "/admin/login")) {
    return null
  }

  // If on login page, just render the children
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: FileText, label: "Blog Articles", href: "/admin/blog" },
    { icon: Users, label: "Agents", href: "/admin/agents" },
    { icon: ClipboardCheck, label: "Registrations", href: "/admin/registrations" },
    { icon: BarChart, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  const isActive = (href: string) => {
    if (href === "/admin" && pathname === "/admin") {
      return true
    }
    return pathname.startsWith(href) && href !== "/admin"
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-yammy-blue flex items-center justify-center text-white font-bubblegum text-lg">
            YY
          </div>
          <span className="font-bubblegum text-lg">Admin Panel</span>
        </div>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Button
                key={index}
                variant={active ? "default" : "ghost"}
                className={`justify-start ${active ? "bg-yammy-blue text-white" : ""}`}
                onClick={() => {
                  router.push(item.href)
                  setIsMobileOpen(false)
                }}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 border-r bg-white md:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1">
        {/* Mobile header */}
        <div className="flex h-14 items-center border-b bg-white px-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-4 font-bubblegum">Yammy Yami Admin</div>
        </div>

        <div className="container mx-auto p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}

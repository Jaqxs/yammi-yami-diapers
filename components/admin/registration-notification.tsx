"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function RegistrationNotification() {
  const [pendingCount, setPendingCount] = useState(0)
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([])
  const router = useRouter()

  // Check for pending registrations
  useEffect(() => {
    const checkPendingRegistrations = () => {
      try {
        const storedRegistrations = localStorage.getItem("yammy-registrations")
        if (storedRegistrations) {
          const parsedRegistrations = JSON.parse(storedRegistrations)
          const pendingRegistrations = parsedRegistrations.filter((reg: any) => reg.status === "pending")
          setPendingCount(pendingRegistrations.length)

          // Get the 5 most recent pending registrations
          const sortedPending = [...pendingRegistrations].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          setRecentRegistrations(sortedPending.slice(0, 5))
        }
      } catch (error) {
        console.error("Error checking pending registrations:", error)
      }
    }

    // Check immediately
    checkPendingRegistrations()

    // Set up event listeners for registration changes
    const handleStorageChange = () => {
      checkPendingRegistrations()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("yammy-registration-added", handleStorageChange)

    // Check periodically
    const intervalId = setInterval(checkPendingRegistrations, 30000) // Check every 30 seconds

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("yammy-registration-added", handleStorageChange)
      clearInterval(intervalId)
    }
  }, [])

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (error) {
      return dateString
    }
  }

  // Navigate to registrations page
  const handleViewAll = () => {
    router.push("/admin/registrations")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {pendingCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-yammy-orange text-white text-xs"
              variant="outline"
            >
              {pendingCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Agent Registration Requests</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentRegistrations.length === 0 ? (
          <div className="py-2 px-4 text-sm text-muted-foreground">No pending registration requests</div>
        ) : (
          recentRegistrations.map((reg) => (
            <DropdownMenuItem key={reg.id} className="cursor-pointer" onClick={handleViewAll}>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{reg.name}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(reg.date)}</span>
                </div>
                <div className="text-xs text-muted-foreground">{reg.email}</div>
                <div className="text-xs">Region: {reg.region}</div>
              </div>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center" onClick={handleViewAll}>
          <Button variant="ghost" size="sm" className="w-full">
            View All Registrations
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

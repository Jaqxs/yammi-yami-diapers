"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export function RegistrationNotifications() {
  const [pendingCount, setPendingCount] = useState(0)
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([])
  const router = useRouter()

  // Load pending registrations
  useEffect(() => {
    const checkPendingRegistrations = () => {
      const storedRegistrations = localStorage.getItem("yammy-registrations")
      if (storedRegistrations) {
        const registrations = JSON.parse(storedRegistrations)
        const pending = registrations.filter((reg: any) => reg.status === "pending")
        setPendingCount(pending.length)

        // Get the 5 most recent registrations
        const sorted = [...pending].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

        setRecentRegistrations(sorted)
      }
    }

    checkPendingRegistrations()

    // Set up event listeners
    const handleStorageChange = () => {
      checkPendingRegistrations()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("registrationAdded", handleStorageChange)

    // Check every minute for new registrations
    const interval = setInterval(checkPendingRegistrations, 60000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("registrationAdded", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 60) {
        return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
      } else {
        return format(date, "MMM d, yyyy")
      }
    } catch (error) {
      return dateString
    }
  }

  // View all registrations
  const handleViewAll = () => {
    router.push("/admin/registrations")
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {pendingCount > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-red-500 text-white">{pendingCount}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Pending Registrations</h4>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              {pendingCount} pending
            </Badge>
          </div>

          <div className="space-y-2">
            {recentRegistrations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">No pending registrations</p>
            ) : (
              recentRegistrations.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-sm font-medium">{reg.name}</p>
                    <p className="text-xs text-muted-foreground">{reg.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(reg.date)}</p>
                </div>
              ))
            )}
          </div>

          {pendingCount > 0 && (
            <Button className="w-full" size="sm" onClick={handleViewAll}>
              View All Registrations
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

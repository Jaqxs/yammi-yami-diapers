"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, X, CheckCircle, XCircle, Clock, Eye, Filter, RefreshCw, Download } from "lucide-react"
import { useStore } from "@/lib/store"
import { mockRegistrations } from "@/data/mock-registrations"

export default function RegistrationsPage() {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedRegistration, setSelectedRegistration] = useState<any | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [registrations, setRegistrations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasNewRegistrations, setHasNewRegistrations] = useState(false)

  // Get store functions
  const { state, loadRegistrations, approveRegistration, rejectRegistration } = useStore()

  // Function to load all registrations from various sources
  const loadAllRegistrations = async () => {
    setIsLoading(true)
    try {
      // First try to load from localStorage
      const storedRegistrations = localStorage.getItem("yammy-registrations")
      let allRegistrations = []

      if (storedRegistrations) {
        try {
          const parsedRegistrations = JSON.parse(storedRegistrations)
          allRegistrations = parsedRegistrations
          console.log("Loaded registrations from localStorage:", parsedRegistrations)
        } catch (error) {
          console.error("Error parsing registrations from localStorage:", error)
        }
      }

      // If no registrations in localStorage, use mock data
      if (allRegistrations.length === 0) {
        allRegistrations = mockRegistrations.map((reg) => ({
          ...reg,
          id: typeof reg.id === "string" ? Number.parseInt(reg.id.replace("reg-", "")) : reg.id,
          date: reg.registrationDate || new Date().toISOString(),
        }))
        console.log("Using mock registrations:", allRegistrations)
      }

      // Update state with all registrations
      setRegistrations(allRegistrations)
      setHasNewRegistrations(false)
    } catch (error) {
      console.error("Error loading registrations:", error)
      toast({
        title: "Error",
        description: "Failed to load registrations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load registrations on mount
  useEffect(() => {
    setMounted(true)
    loadAllRegistrations()

    // Set up event listeners for new registrations
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "yammy-registrations" || event.key === "yammy-registration-added") {
        console.log("Registration storage changed:", event)
        setHasNewRegistrations(true)
      }
    }

    const handleCustomEvent = (event: Event) => {
      console.log("Custom registration event received:", event)
      setHasNewRegistrations(true)
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("yammy-registration-added", handleCustomEvent)

    // Set up polling to check for new registrations
    const intervalId = setInterval(() => {
      const storedRegistrations = localStorage.getItem("yammy-registrations")
      if (storedRegistrations) {
        try {
          const parsedRegistrations = JSON.parse(storedRegistrations)
          if (parsedRegistrations.length !== registrations.length) {
            setHasNewRegistrations(true)
          }
        } catch (error) {
          console.error("Error checking for new registrations:", error)
        }
      }
    }, 30000) // Check every 30 seconds

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("yammy-registration-added", handleCustomEvent)
      clearInterval(intervalId)
    }
  }, [])

  // Refresh registrations
  const handleRefresh = () => {
    loadAllRegistrations()
  }

  if (!mounted) return null

  // Filter registrations based on search term and status filter
  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      registration.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.paymentReference?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || registration.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a")
    } catch (error) {
      return dateString
    }
  }

  // Handle approving a registration
  const handleApprove = async () => {
    if (!selectedRegistration) return

    try {
      setIsLoading(true)

      // Update the registration status in localStorage
      const storedRegistrations = localStorage.getItem("yammy-registrations")
      if (storedRegistrations) {
        const parsedRegistrations = JSON.parse(storedRegistrations)
        const updatedRegistrations = parsedRegistrations.map((reg: any) =>
          reg.id === selectedRegistration.id
            ? {
                ...reg,
                status: "approved",
                reviewedBy: "Admin User",
                notes: notes,
                reviewDate: new Date().toISOString(),
              }
            : reg,
        )

        localStorage.setItem("yammy-registrations", JSON.stringify(updatedRegistrations))
        setRegistrations(updatedRegistrations)
      }

      // Also update in the store if available
      try {
        await approveRegistration(selectedRegistration.id, "Admin User", notes)
      } catch (error) {
        console.error("Error updating registration in store:", error)
      }

      // Trigger a localStorage event to notify other tabs/windows
      const event = new StorageEvent("storage", {
        key: "registration-status-change",
        newValue: JSON.stringify({
          email: selectedRegistration.email,
          status: "approved",
        }),
      })
      window.dispatchEvent(event)

      setIsApproveDialogOpen(false)
      setSelectedRegistration(null)
      setNotes("")

      toast({
        title: "Registration Approved",
        description: "The agent registration has been approved successfully.",
      })
    } catch (error) {
      console.error("Error approving registration:", error)
      toast({
        title: "Error",
        description: "Failed to approve registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle rejecting a registration
  const handleReject = async () => {
    if (!selectedRegistration) return

    try {
      setIsLoading(true)

      // Update the registration status in localStorage
      const storedRegistrations = localStorage.getItem("yammy-registrations")
      if (storedRegistrations) {
        const parsedRegistrations = JSON.parse(storedRegistrations)
        const updatedRegistrations = parsedRegistrations.map((reg: any) =>
          reg.id === selectedRegistration.id
            ? {
                ...reg,
                status: "rejected",
                reviewedBy: "Admin User",
                notes: notes,
                reviewDate: new Date().toISOString(),
              }
            : reg,
        )

        localStorage.setItem("yammy-registrations", JSON.stringify(updatedRegistrations))
        setRegistrations(updatedRegistrations)
      }

      // Also update in the store if available
      try {
        await rejectRegistration(selectedRegistration.id, "Admin User", notes)
      } catch (error) {
        console.error("Error updating registration in store:", error)
      }

      // Trigger a localStorage event to notify other tabs/windows
      const event = new StorageEvent("storage", {
        key: "registration-status-change",
        newValue: JSON.stringify({
          email: selectedRegistration.email,
          status: "rejected",
        }),
      })
      window.dispatchEvent(event)

      setIsRejectDialogOpen(false)
      setSelectedRegistration(null)
      setNotes("")

      toast({
        title: "Registration Rejected",
        description: "The agent registration has been rejected.",
      })
    } catch (error) {
      console.error("Error rejecting registration:", error)
      toast({
        title: "Error",
        description: "Failed to reject registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Export registrations to CSV
  const handleExport = () => {
    try {
      const headers = ["ID", "Name", "Email", "Phone", "Region", "Payment Ref", "Date", "Status", "Notes"]
      const csvRows = [headers.join(",")]

      filteredRegistrations.forEach((reg) => {
        const row = [
          reg.id,
          `"${reg.name || ""}"`,
          `"${reg.email || ""}"`,
          `"${reg.phone || ""}"`,
          `"${reg.region || ""}"`,
          `"${reg.paymentReference || ""}"`,
          `"${reg.date ? formatDate(reg.date) : ""}"`,
          `"${reg.status || ""}"`,
          `"${reg.notes || ""}"`,
        ]
        csvRows.push(row.join(","))
      })

      const csvContent = csvRows.join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `agent-registrations-${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export Successful",
        description: "Registrations have been exported to CSV.",
      })
    } catch (error) {
      console.error("Error exporting registrations:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export registrations. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-yammy-dark-blue font-bubblegum">Agent Registrations</h1>
        <p className="text-muted-foreground">Review and manage agent registration applications.</p>
      </div>

      <Card className="mt-6 border-yammy-blue/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Registrations List</CardTitle>
            <CardDescription>Review and approve agent registration applications</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isLoading || registrations.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant={hasNewRegistrations ? "default" : "outline"}
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className={hasNewRegistrations ? "bg-yammy-orange hover:bg-yammy-orange/90" : ""}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {hasNewRegistrations ? "New Registrations!" : isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search registrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              {searchTerm && (
                <Button variant="ghost" size="icon" onClick={() => setSearchTerm("")} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)} className="w-[300px]">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Pending
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Approved
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> Rejected
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Payment Ref</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        Loading registrations...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No registrations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>{registration.id}</TableCell>
                      <TableCell>{registration.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{registration.email}</span>
                          <span className="text-xs text-muted-foreground">{registration.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>{registration.region}</TableCell>
                      <TableCell>{registration.paymentReference}</TableCell>
                      <TableCell>{formatDate(registration.date)}</TableCell>
                      <TableCell>{getStatusBadge(registration.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedRegistration(registration)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>

                          {registration.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                onClick={() => {
                                  setSelectedRegistration(registration)
                                  setIsApproveDialogOpen(true)
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedRegistration(registration)
                                  setIsRejectDialogOpen(true)
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Registration Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>View the complete registration information.</DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">ID</Label>
                <div className="col-span-3">{selectedRegistration.id}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <div className="col-span-3">{selectedRegistration.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <div className="col-span-3">{selectedRegistration.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Phone</Label>
                <div className="col-span-3">{selectedRegistration.phone}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Region</Label>
                <div className="col-span-3">{selectedRegistration.region}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Payment Ref</Label>
                <div className="col-span-3">{selectedRegistration.paymentReference}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Date</Label>
                <div className="col-span-3">{formatDate(selectedRegistration.date)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3">{getStatusBadge(selectedRegistration.status)}</div>
              </div>

              {selectedRegistration.reviewedBy && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Reviewed By</Label>
                    <div className="col-span-3">{selectedRegistration.reviewedBy}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Review Date</Label>
                    <div className="col-span-3">
                      {selectedRegistration.reviewDate ? formatDate(selectedRegistration.reviewDate) : "N/A"}
                    </div>
                  </div>
                </>
              )}

              {selectedRegistration.notes && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right">Notes</Label>
                  <div className="col-span-3">{selectedRegistration.notes}</div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedRegistration?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setIsRejectDialogOpen(true)
                  }}
                >
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setIsApproveDialogOpen(true)
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Registration Dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this registration? This will grant the user agent access.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this approval"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNotes("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-green-600 hover:bg-green-700" onClick={handleApprove} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Approve Registration"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Registration Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this registration? Please provide a reason for the rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reject-notes">Rejection Reason</Label>
              <Textarea
                id="reject-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Provide a reason for rejecting this registration"
                required
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNotes("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleReject} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Reject Registration"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

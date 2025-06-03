"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useStore, type Registration } from "@/lib/store"
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
import { Search, X, CheckCircle, XCircle, Clock, Eye, Filter, RefreshCw } from "lucide-react"

export default function RegistrationsPage() {
  const { state, loadRegistrations, approveRegistration, rejectRegistration } = useStore()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    setMounted(true)
    loadRegistrations()
  }, [loadRegistrations])

  if (!mounted) return null

  // Filter registrations based on search term and status filter
  const filteredRegistrations = state.registrations.filter((registration) => {
    const matchesSearch =
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.paymentReference.toLowerCase().includes(searchTerm.toLowerCase())

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
      await approveRegistration(selectedRegistration.id, "Admin User", notes)

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

      // Refresh the registrations list
      loadRegistrations()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve registration.",
        variant: "destructive",
      })
    }
  }

  // Handle rejecting a registration
  const handleReject = async () => {
    if (!selectedRegistration) return

    try {
      await rejectRegistration(selectedRegistration.id, "Admin User", notes)

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

      // Refresh the registrations list
      loadRegistrations()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject registration.",
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
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
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
          <Button variant="outline" size="sm" onClick={() => loadRegistrations()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
                  <TableHead>Payment Ref</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
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
            <AlertDialogAction className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
              Approve Registration
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
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleReject}>
              Reject Registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

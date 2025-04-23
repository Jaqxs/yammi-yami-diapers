"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreHorizontal, Eye, Truck, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Pagination } from "@/components/admin/pagination"

// Mock order data
const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john.doe@example.com",
    phone: "+255 712 345 678",
    date: "2025-04-20T10:30:00Z",
    total: 58000,
    status: "completed",
    items: [
      { id: 1, name: "Premium Baby Diapers", quantity: 2, price: 18000 },
      { id: 2, name: "Baby Pull-up Pants", quantity: 1, price: 22000 },
    ],
    paymentMethod: "Cash on Delivery",
    shippingAddress: "123 Main St, Dar es Salaam",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+255 723 456 789",
    date: "2025-04-19T14:45:00Z",
    total: 45000,
    status: "processing",
    items: [
      { id: 5, name: "Adult Pants", quantity: 1, price: 25000 },
      { id: 6, name: "Baby Wipes", quantity: 5, price: 4000 },
    ],
    paymentMethod: "M-Pesa",
    shippingAddress: "456 Oak St, Dar es Salaam",
  },
  {
    id: "ORD-003",
    customer: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "+255 734 567 890",
    date: "2025-04-18T09:15:00Z",
    total: 103000,
    status: "shipped",
    items: [{ id: 8, name: "Wholesale Carton - Baby Pants", quantity: 1, price: 103000 }],
    paymentMethod: "Bank Transfer",
    shippingAddress: "789 Pine St, Arusha",
  },
  {
    id: "ORD-004",
    customer: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+255 745 678 901",
    date: "2025-04-17T16:20:00Z",
    total: 40000,
    status: "cancelled",
    items: [{ id: 2, name: "Baby Pull-up Pants", quantity: 2, price: 20000 }],
    paymentMethod: "Cash on Delivery",
    shippingAddress: "101 Elm St, Mwanza",
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    email: "david.b@example.com",
    phone: "+255 756 789 012",
    date: "2025-04-16T11:10:00Z",
    total: 75000,
    status: "pending",
    items: [
      { id: 3, name: "Baby Pull-up Pants", quantity: 2, price: 20000 },
      { id: 5, name: "Adult Pants", quantity: 1, price: 25000 },
      { id: 6, name: "Baby Wipes", quantity: 2, price: 4000 },
    ],
    paymentMethod: "M-Pesa",
    shippingAddress: "202 Maple St, Dodoma",
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<(typeof mockOrders)[0] | null>(null)
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter orders based on search and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle view order
  const handleViewOrder = (order: (typeof mockOrders)[0]) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  // Handle update status
  const handleUpdateStatusClick = (order: (typeof mockOrders)[0]) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsUpdateStatusDialogOpen(true)
  }

  const handleUpdateStatusConfirm = () => {
    if (selectedOrder && newStatus) {
      setOrders(orders.map((order) => (order.id === selectedOrder.id ? { ...order, status: newStatus } : order)))

      toast({
        title: "Order status updated",
        description: `Order ${selectedOrder.id} status changed to ${newStatus}`,
      })
    }
    setIsUpdateStatusDialogOpen(false)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString()}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bubblegum text-yammy-dark-blue">Orders</h1>
          <p className="text-gray-500">Manage customer orders</p>
        </div>
        <Button variant="outline" className="border-yammy-blue/30 text-yammy-blue">
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search orders by ID, customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="md:w-[100px]">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Orders Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={6} className="h-16">
                    <div className="w-full h-8 bg-gray-200 animate-pulse rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.customer}</span>
                      <span className="text-xs text-gray-500">{order.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "cancelled"
                            ? "destructive"
                            : "outline"
                      }
                      className={
                        order.status === "completed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : order.status === "shipped"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatusClick(order)}>
                          <Truck className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination totalItems={filteredOrders.length} itemsPerPage={10} currentPage={1} onPageChange={() => {}} />

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Order ID:</span>
                      <span className="text-sm font-medium">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm">{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <Badge
                        variant={
                          selectedOrder.status === "completed"
                            ? "default"
                            : selectedOrder.status === "cancelled"
                              ? "destructive"
                              : "outline"
                        }
                        className={
                          selectedOrder.status === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : selectedOrder.status === "cancelled"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : selectedOrder.status === "processing"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : selectedOrder.status === "shipped"
                                  ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }
                      >
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Payment Method:</span>
                      <span className="text-sm">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="text-sm">{selectedOrder.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="text-sm">{selectedOrder.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="text-sm">{selectedOrder.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Shipping Address:</span>
                      <span className="text-sm">{selectedOrder.shippingAddress}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(selectedOrder.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-yammy-blue hover:bg-yammy-dark-blue"
              onClick={() => {
                setIsViewDialogOpen(false)
                if (selectedOrder) {
                  handleUpdateStatusClick(selectedOrder)
                }
              }}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>{selectedOrder && `Change the status for order ${selectedOrder.id}`}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-yammy-blue hover:bg-yammy-dark-blue" onClick={handleUpdateStatusConfirm}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

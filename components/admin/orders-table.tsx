"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface OrdersTableProps {
  isLoading: boolean
}

export function OrdersTable({ isLoading }: OrdersTableProps) {
  // Mock orders data
  const orders = [
    {
      id: "ORD-001",
      customer: "John Doe",
      date: "2025-04-20T10:30:00Z",
      total: 58000,
      status: "completed",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      date: "2025-04-19T14:45:00Z",
      total: 45000,
      status: "processing",
    },
    {
      id: "ORD-003",
      customer: "Michael Johnson",
      date: "2025-04-18T09:15:00Z",
      total: 103000,
      status: "shipped",
    },
    {
      id: "ORD-004",
      customer: "Sarah Williams",
      date: "2025-04-17T16:20:00Z",
      total: 40000,
      status: "cancelled",
    },
    {
      id: "ORD-005",
      customer: "David Brown",
      date: "2025-04-16T11:10:00Z",
      total: 75000,
      status: "pending",
    },
  ]

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-12 bg-gray-200 animate-pulse rounded"></div>
        ))}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{formatDate(order.date)}</TableCell>
            <TableCell>{formatCurrency(order.total)}</TableCell>
            <TableCell>
              <Badge
                variant={
                  order.status === "completed" ? "default" : order.status === "cancelled" ? "destructive" : "outline"
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

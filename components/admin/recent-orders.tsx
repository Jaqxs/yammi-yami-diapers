import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for recent orders
const recentOrders = [
  {
    id: "ORD-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "completed",
    products: ["Baby Diapers (S)", "Baby Wipes"],
    total: "$42.50",
    date: "2023-04-20",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "processing",
    products: ["Baby Diapers (M)", "Lady Pads"],
    total: "$38.75",
    date: "2023-04-19",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Robert Johnson",
      email: "robert@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "shipped",
    products: ["Baby Diapers (L)", "Baby Powder"],
    total: "$55.20",
    date: "2023-04-18",
  },
  {
    id: "ORD-004",
    customer: {
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "pending",
    products: ["Lady Pads", "Baby Wipes"],
    total: "$29.99",
    date: "2023-04-17",
  },
  {
    id: "ORD-005",
    customer: {
      name: "Michael Wilson",
      email: "michael@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    status: "completed",
    products: ["Baby Diapers (XL)"],
    total: "$35.50",
    date: "2023-04-16",
  },
]

// Status badge colors
const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  shipped: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
}

export function RecentOrders() {
  return (
    <div className="space-y-8">
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-10 px-4 text-left font-medium">Order</th>
                <th className="h-10 px-4 text-left font-medium">Customer</th>
                <th className="h-10 px-4 text-left font-medium">Products</th>
                <th className="h-10 px-4 text-left font-medium">Status</th>
                <th className="h-10 px-4 text-left font-medium">Total</th>
                <th className="h-10 px-4 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{order.id}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={order.customer.avatar || "/placeholder.svg"} alt={order.customer.name} />
                        <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex flex-col gap-0.5">
                      {order.products.map((product, index) => (
                        <span key={index} className="text-xs">
                          {product}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant="outline" className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{order.total}</td>
                  <td className="p-4 align-middle">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

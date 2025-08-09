// Simplified mock data for recent orders
const recentOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    status: "completed",
    productList: "Baby Diapers (S), Baby Wipes",
    total: "$42.50",
    date: "2023-04-20",
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    status: "processing",
    productList: "Baby Diapers (M), Lady Pads",
    total: "$38.75",
    date: "2023-04-19",
  },
  {
    id: "ORD-003",
    customerName: "Robert Johnson",
    customerEmail: "robert@example.com",
    status: "shipped",
    productList: "Baby Diapers (L), Baby Powder",
    total: "$55.20",
    date: "2023-04-18",
  },
  {
    id: "ORD-004",
    customerName: "Emily Davis",
    customerEmail: "emily@example.com",
    status: "pending",
    productList: "Lady Pads, Baby Wipes",
    total: "$29.99",
    date: "2023-04-17",
  },
  {
    id: "ORD-005",
    customerName: "Michael Wilson",
    customerEmail: "michael@example.com",
    status: "completed",
    productList: "Baby Diapers (XL)",
    total: "$35.50",
    date: "2023-04-16",
  },
]

// Simple status badge styles without using the Badge component
const getStatusStyle = (status: string): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "shipped":
      return "bg-purple-100 text-purple-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
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
                    <div className="grid gap-0.5">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs">{order.productList}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
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

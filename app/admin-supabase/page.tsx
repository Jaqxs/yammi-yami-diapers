"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Activity,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useRealtime } from "@/lib/realtime-store"

export default function SupabaseAdminDashboard() {
  const { products, orders, analytics, isLoading, lastUpdated, refreshProducts, refreshOrders, refreshAnalytics } =
    useRealtime()

  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      await refreshAnalytics()
      toast({
        title: "Success",
        description: "Data refreshed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "low_stock":
        return "bg-yellow-100 text-yellow-800"
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const lowStockProducts = products.filter((p) => p.stock < 10)
  const recentOrders = orders.slice(0, 5)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yammy-blue"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-yammy-dark-blue flex items-center gap-2">
            <Activity className="h-8 w-8 text-green-500" />
            Real-time Admin Dashboard
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : "Loading..."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshData} variant="outline" disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button asChild className="bg-yammy-blue hover:bg-yammy-dark-blue">
            <Link href="/admin-supabase/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="mb-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-medium">Real-time sync active</span>
              <span className="text-green-600 text-sm">
                • Products: {products.length} • Orders: {orders.length} • Low Stock: {lowStockProducts.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">{analytics.lowStockCount} low stock</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-1 h-full bg-yammy-blue"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-1 h-full bg-green-500"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From paid orders</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-1 h-full bg-yellow-500"></div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.filter((p) => p.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Ready for sale</p>
          </CardContent>
          <div className="absolute top-0 right-0 w-1 h-full bg-purple-500"></div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Live Overview</TabsTrigger>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Recent Orders
                  <Badge variant="outline" className="ml-auto">
                    Live
                  </Badge>
                </CardTitle>
                <CardDescription>Latest customer orders (real-time)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">{order.customer_email}</p>
                          <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                          <div className="flex gap-1 mt-1">
                            <Badge className={getStatusColor(order.status)} variant="outline">
                              {order.status}
                            </Badge>
                            <Badge className={getStatusColor(order.payment_status)} variant="outline">
                              {order.payment_status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No recent orders</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Low Stock Alert
                  <Badge variant="destructive" className="ml-auto">
                    {lowStockProducts.length}
                  </Badge>
                </CardTitle>
                <CardDescription>Products running low on inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockProducts.length > 0 ? (
                    lowStockProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {product.image_url ? (
                              <img
                                src={product.image_url || "/placeholder.svg"}
                                alt={product.name_en}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name_en}</p>
                            <p className="text-sm text-gray-500">{product.category?.name_en}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">{product.stock} left</p>
                          <Badge variant="destructive">Low Stock</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">All products well stocked! 🎉</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button asChild className="h-20 flex-col gap-2">
                  <Link href="/admin-supabase/products/new">
                    <Plus className="h-6 w-6" />
                    Add New Product
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2">
                  <Link href="/admin-supabase/orders">
                    <ShoppingCart className="h-6 w-6" />
                    Manage Orders
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2">
                  <Link href="/admin-supabase/products">
                    <Package className="h-6 w-6" />
                    View All Products
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Products (Real-time)</h2>
            <Button asChild className="bg-yammy-blue hover:bg-yammy-dark-blue">
              <Link href="/admin-supabase/products">
                <Eye className="h-4 w-4 mr-2" />
                Manage All Products
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {products.slice(0, 10).map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name_en}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{product.name_en}</h3>
                        <p className="text-sm text-gray-500">{product.name_sw}</p>
                        <p className="text-sm text-gray-500">{product.category?.name_en}</p>
                        <p className="text-sm font-medium">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className={`font-medium ${product.stock < 10 ? "text-red-600" : ""}`}>{product.stock}</p>
                      </div>
                      <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin-supabase/products/${product.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin-supabase/products/${product.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Orders (Real-time)</h2>
            <Button asChild className="bg-yammy-blue hover:bg-yammy-dark-blue">
              <Link href="/admin-supabase/orders">
                <Eye className="h-4 w-4 mr-2" />
                Manage All Orders
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {orders.slice(0, 10).map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{order.customer_name}</h3>
                      <p className="text-sm text-gray-500">{order.customer_email}</p>
                      <p className="text-sm text-gray-500">{order.customer_phone}</p>
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <Badge className={getStatusColor(order.payment_status)}>{order.payment_status}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Real-time Analytics</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Total revenue from paid orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yammy-blue">{formatCurrency(analytics.totalRevenue)}</div>
                <p className="text-sm text-gray-500 mt-2">From {analytics.totalOrders} total orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Current stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Products:</span>
                    <span className="font-medium">{analytics.totalProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Products:</span>
                    <span className="font-medium text-green-600">
                      {products.filter((p) => p.status === "active").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Stock Items:</span>
                    <span className="font-medium text-yellow-600">{analytics.lowStockCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out of Stock:</span>
                    <span className="font-medium text-red-600">
                      {products.filter((p) => p.status === "out_of_stock").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Current order distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span className="font-medium text-blue-600">
                      {orders.filter((o) => o.status === "pending").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing:</span>
                    <span className="font-medium text-yellow-600">
                      {orders.filter((o) => o.status === "processing").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivered:</span>
                    <span className="font-medium text-green-600">
                      {orders.filter((o) => o.status === "delivered").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelled:</span>
                    <span className="font-medium text-red-600">
                      {orders.filter((o) => o.status === "cancelled").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

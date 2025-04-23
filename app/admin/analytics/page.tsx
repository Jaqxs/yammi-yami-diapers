"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SalesChart } from "@/components/admin/sales-chart"
import { ProductsChart } from "@/components/admin/products-chart"
import { OrdersTable } from "@/components/admin/orders-table"
import { RegionsChart } from "@/components/admin/regions-chart"

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30days")

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Mock analytics data
  const analyticsData = {
    totalSales: 2450000,
    salesGrowth: 12.5,
    totalOrders: 124,
    ordersGrowth: 8.3,
    averageOrderValue: 19758,
    aovGrowth: 3.7,
    totalCustomers: 87,
    customersGrowth: 15.2,
    topSellingProducts: [
      { name: "Baby Pull-up Pants (L)", sales: 42, percentage: 25 },
      { name: "Premium Baby Diapers (S)", sales: 35, percentage: 21 },
      { name: "Adult Pants (L)", sales: 28, percentage: 17 },
      { name: "Baby Wipes", sales: 22, percentage: 13 },
      { name: "Baby Pull-up Pants (XL)", sales: 18, percentage: 11 },
    ],
    salesByRegion: [
      { region: "Dar es Salaam", sales: 1470000, percentage: 60 },
      { region: "Arusha", sales: 367500, percentage: 15 },
      { region: "Mwanza", sales: 245000, percentage: 10 },
      { region: "Dodoma", sales: 122500, percentage: 5 },
      { region: "Other Regions", sales: 245000, percentage: 10 },
    ],
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bubblegum text-yammy-dark-blue">Analytics</h1>
          <p className="text-gray-500">Track your store performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-yammy-blue/30 text-yammy-blue">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Sales"
          value={formatCurrency(analyticsData.totalSales)}
          change={analyticsData.salesGrowth}
          icon={DollarSign}
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Orders"
          value={analyticsData.totalOrders.toString()}
          change={analyticsData.ordersGrowth}
          icon={ShoppingCart}
          isLoading={isLoading}
        />
        <StatsCard
          title="Average Order Value"
          value={formatCurrency(analyticsData.averageOrderValue)}
          change={analyticsData.aovGrowth}
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Customers"
          value={analyticsData.totalCustomers.toString()}
          change={analyticsData.customersGrowth}
          icon={Users}
          isLoading={isLoading}
        />
      </div>

      {/* Charts and Tables */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                {dateRange === "7days" && "Sales data for the last 7 days"}
                {dateRange === "30days" && "Sales data for the last 30 days"}
                {dateRange === "90days" && "Sales data for the last 90 days"}
                {dateRange === "year" && "Sales data for this year"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesChart isLoading={isLoading} dateRange={dateRange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrdersTable isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performing products by sales</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductsChart isLoading={isLoading} data={analyticsData.topSellingProducts} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>Sales by product category</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="w-full h-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yammy-blue mr-2"></div>
                        <span>Baby Diapers</span>
                      </div>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yammy-pink mr-2"></div>
                        <span>Baby Pants</span>
                      </div>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yammy-orange mr-2"></div>
                        <span>Adult Pants</span>
                      </div>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                        <span>Baby Wipes</span>
                      </div>
                      <span className="font-medium">5%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current inventory levels</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Premium Baby Diapers (S)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                      <span className="text-sm">120 units</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Baby Pull-up Pants (M)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <span className="text-sm">85 units</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Baby Pull-up Pants (L)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "50%" }}></div>
                      </div>
                      <span className="text-sm">65 units</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Adult Pants (L)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                      <span className="text-sm">30 units</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Premium Royal Baby Pants (L)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                      <span className="text-sm">15 units</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New customers over time</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="w-full h-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <div className="h-[300px] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500">Customer growth chart will be displayed here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>Customer distribution by region</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="w-full h-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <div className="h-[300px] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500">Customer demographics chart will be displayed here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Retention</CardTitle>
              <CardDescription>Repeat purchase rate</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded"></div>
                </div>
              ) : (
                <div className="h-[200px] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Customer retention chart will be displayed here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regions Tab */}
        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Region</CardTitle>
              <CardDescription>Distribution of sales across regions</CardDescription>
            </CardHeader>
            <CardContent>
              <RegionsChart isLoading={isLoading} data={analyticsData.salesByRegion} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>Detailed breakdown by region</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded"></div>
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Region
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Sales
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Orders
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Customers
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Avg. Order Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium">Dar es Salaam</td>
                        <td className="px-6 py-4">{formatCurrency(1470000)}</td>
                        <td className="px-6 py-4">74</td>
                        <td className="px-6 py-4">52</td>
                        <td className="px-6 py-4">{formatCurrency(19865)}</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium">Arusha</td>
                        <td className="px-6 py-4">{formatCurrency(367500)}</td>
                        <td className="px-6 py-4">19</td>
                        <td className="px-6 py-4">14</td>
                        <td className="px-6 py-4">{formatCurrency(19342)}</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium">Mwanza</td>
                        <td className="px-6 py-4">{formatCurrency(245000)}</td>
                        <td className="px-6 py-4">12</td>
                        <td className="px-6 py-4">9</td>
                        <td className="px-6 py-4">{formatCurrency(20417)}</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium">Dodoma</td>
                        <td className="px-6 py-4">{formatCurrency(122500)}</td>
                        <td className="px-6 py-4">7</td>
                        <td className="px-6 py-4">5</td>
                        <td className="px-6 py-4">{formatCurrency(17500)}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-6 py-4 font-medium">Other Regions</td>
                        <td className="px-6 py-4">{formatCurrency(245000)}</td>
                        <td className="px-6 py-4">12</td>
                        <td className="px-6 py-4">7</td>
                        <td className="px-6 py-4">{formatCurrency(20417)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string
  change: number
  icon: React.ElementType
  isLoading: boolean
}

function StatsCard({ title, value, change, icon: Icon, isLoading }: StatsCardProps) {
  const isPositive = change >= 0

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="bg-yammy-light-blue p-2 rounded-full">
              <Icon className="h-5 w-5 text-yammy-blue" />
            </div>
            {isPositive ? (
              <div className="flex items-center text-green-500 text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                {change}%
              </div>
            ) : (
              <div className="flex items-center text-red-500 text-sm font-medium">
                <TrendingDown className="h-4 w-4 mr-1" />
                {Math.abs(change)}%
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold text-yammy-dark-blue">{value}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">Last 30 days</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRealtime } from "@/lib/realtime-store"

export function RealtimeNotifications() {
  const { products, orders, analytics, lastUpdated } = useRealtime()
  const { toast } = useToast()
  const [previousCounts, setPreviousCounts] = useState({
    products: 0,
    orders: 0,
    lowStock: 0,
  })

  useEffect(() => {
    if (!lastUpdated) return

    const currentCounts = {
      products: products.length,
      orders: orders.length,
      lowStock: analytics.lowStockCount,
    }

    // Check for new products
    if (currentCounts.products > previousCounts.products) {
      toast({
        title: "New Product Added",
        description: `${currentCounts.products - previousCounts.products} new product(s) added to inventory`,
        duration: 5000,
      })
    }

    // Check for new orders
    if (currentCounts.orders > previousCounts.orders) {
      toast({
        title: "New Order Received",
        description: `${currentCounts.orders - previousCounts.orders} new order(s) received`,
        duration: 5000,
      })
    }

    // Check for low stock alerts
    if (currentCounts.lowStock > previousCounts.lowStock) {
      toast({
        title: "Low Stock Alert",
        description: `${currentCounts.lowStock - previousCounts.lowStock} product(s) now have low stock`,
        variant: "destructive",
        duration: 5000,
      })
    }

    setPreviousCounts(currentCounts)
  }, [products.length, orders.length, analytics.lowStockCount, lastUpdated, previousCounts, toast])

  return null // This component only handles notifications
}

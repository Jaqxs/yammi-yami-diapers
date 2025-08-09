"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { Product, Order, Agent, Category } from "@/lib/supabase"

interface RealtimeState {
  products: Product[]
  orders: Order[]
  agents: Agent[]
  categories: Category[]
  analytics: {
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    lowStockCount: number
  }
  isLoading: boolean
  lastUpdated: Date | null
}

interface RealtimeContextType extends RealtimeState {
  refreshProducts: () => Promise<void>
  refreshOrders: () => Promise<void>
  refreshAnalytics: () => Promise<void>
  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => Promise<Product | null>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<boolean>
  createOrder: (order: Omit<Order, "id" | "created_at" | "updated_at">) => Promise<Order | null>
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<boolean>
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RealtimeState>({
    products: [],
    orders: [],
    agents: [],
    categories: [],
    analytics: {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      lowStockCount: 0,
    },
    isLoading: true,
    lastUpdated: null,
  })

  // Fetch products with real-time updates
  const refreshProducts = useCallback(async () => {
    try {
      const { data: products, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setState((prev) => ({
        ...prev,
        products: products || [],
        lastUpdated: new Date(),
      }))

      // Update analytics
      const totalProducts = products?.length || 0
      const lowStockCount = products?.filter((p) => p.stock < 10).length || 0

      setState((prev) => ({
        ...prev,
        analytics: {
          ...prev.analytics,
          totalProducts,
          lowStockCount,
        },
      }))
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }, [])

  // Fetch orders with real-time updates
  const refreshOrders = useCallback(async () => {
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setState((prev) => ({
        ...prev,
        orders: orders || [],
        lastUpdated: new Date(),
      }))

      // Update analytics
      const totalOrders = orders?.length || 0
      const totalRevenue =
        orders?.reduce((sum, order) => {
          return order.payment_status === "paid" ? sum + order.total_amount : sum
        }, 0) || 0

      setState((prev) => ({
        ...prev,
        analytics: {
          ...prev.analytics,
          totalOrders,
          totalRevenue,
        },
      }))
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }, [])

  // Fetch analytics
  const refreshAnalytics = useCallback(async () => {
    await Promise.all([refreshProducts(), refreshOrders()])
  }, [refreshProducts, refreshOrders])

  // CRUD Operations
  const addProduct = useCallback(async (productData: Omit<Product, "id" | "created_at" | "updated_at">) => {
    try {
      const { data: product, error } = await supabase
        .from("products")
        .insert([
          {
            ...productData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select(`
          *,
          category:categories(*)
        `)
        .single()

      if (error) throw error

      // Update local state immediately
      setState((prev) => ({
        ...prev,
        products: [product, ...prev.products],
        analytics: {
          ...prev.analytics,
          totalProducts: prev.analytics.totalProducts + 1,
        },
        lastUpdated: new Date(),
      }))

      return product
    } catch (error) {
      console.error("Error adding product:", error)
      return null
    }
  }, [])

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      const { data: product, error } = await supabase
        .from("products")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select(`
          *,
          category:categories(*)
        `)
        .single()

      if (error) throw error

      // Update local state immediately
      setState((prev) => ({
        ...prev,
        products: prev.products.map((p) => (p.id === id ? product : p)),
        lastUpdated: new Date(),
      }))

      return product
    } catch (error) {
      console.error("Error updating product:", error)
      return null
    }
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error

      // Update local state immediately
      setState((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== id),
        analytics: {
          ...prev.analytics,
          totalProducts: prev.analytics.totalProducts - 1,
        },
        lastUpdated: new Date(),
      }))

      return true
    } catch (error) {
      console.error("Error deleting product:", error)
      return false
    }
  }, [])

  const createOrder = useCallback(async (orderData: Omit<Order, "id" | "created_at" | "updated_at">) => {
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert([
          {
            ...orderData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select(`
          *,
          order_items(
            *,
            product:products(*)
          )
        `)
        .single()

      if (error) throw error

      // Update local state immediately
      setState((prev) => ({
        ...prev,
        orders: [order, ...prev.orders],
        analytics: {
          ...prev.analytics,
          totalOrders: prev.analytics.totalOrders + 1,
          totalRevenue:
            order.payment_status === "paid"
              ? prev.analytics.totalRevenue + order.total_amount
              : prev.analytics.totalRevenue,
        },
        lastUpdated: new Date(),
      }))

      return order
    } catch (error) {
      console.error("Error creating order:", error)
      return null
    }
  }, [])

  const updateOrderStatus = useCallback(async (id: string, status: Order["status"]) => {
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Update local state immediately
      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        lastUpdated: new Date(),
      }))

      return true
    } catch (error) {
      console.error("Error updating order status:", error)
      return false
    }
  }, [])

  // Set up real-time subscriptions
  useEffect(() => {
    // Initial data load
    const loadInitialData = async () => {
      setState((prev) => ({ ...prev, isLoading: true }))

      // Fetch categories first
      const { data: categories } = await supabase.from("categories").select("*").order("name_en")

      setState((prev) => ({
        ...prev,
        categories: categories || [],
      }))

      // Then fetch other data
      await Promise.all([refreshProducts(), refreshOrders()])

      setState((prev) => ({ ...prev, isLoading: false }))
    }

    loadInitialData()

    // Set up real-time subscriptions
    const productsSubscription = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          console.log("Products change detected:", payload)
          refreshProducts()
        },
      )
      .subscribe()

    const ordersSubscription = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("Orders change detected:", payload)
          refreshOrders()
        },
      )
      .subscribe()

    const categoriesSubscription = supabase
      .channel("categories-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "categories",
        },
        async (payload) => {
          console.log("Categories change detected:", payload)
          const { data: categories } = await supabase.from("categories").select("*").order("name_en")

          setState((prev) => ({
            ...prev,
            categories: categories || [],
            lastUpdated: new Date(),
          }))
        },
      )
      .subscribe()

    // Cleanup subscriptions
    return () => {
      productsSubscription.unsubscribe()
      ordersSubscription.unsubscribe()
      categoriesSubscription.unsubscribe()
    }
  }, [refreshProducts, refreshOrders])

  // Auto-refresh every 30 seconds as fallback
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAnalytics()
    }, 30000)

    return () => clearInterval(interval)
  }, [refreshAnalytics])

  const contextValue: RealtimeContextType = {
    ...state,
    refreshProducts,
    refreshOrders,
    refreshAnalytics,
    addProduct,
    updateProduct,
    deleteProduct,
    createOrder,
    updateOrderStatus,
  }

  return <RealtimeContext.Provider value={contextValue}>{children}</RealtimeContext.Provider>
}

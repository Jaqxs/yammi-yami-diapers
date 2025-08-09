import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Get total products
    const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

    // Get total orders
    const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

    // Get total agents
    const { count: totalAgents } = await supabase.from("agents").select("*", { count: "exact", head: true })

    // Get total revenue
    const { data: revenueData } = await supabase.from("orders").select("total_amount").eq("payment_status", "paid")

    const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

    // Get products by category
    const { data: categoryData } = await supabase.from("products").select(`
        category_id,
        category:categories(name_en)
      `)

    const categoryBreakdown = categoryData?.reduce((acc: any, product) => {
      const categoryName = product.category?.name_en || "Uncategorized"
      acc[categoryName] = (acc[categoryName] || 0) + 1
      return acc
    }, {})

    // Get recent orders
    const { data: recentOrders } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(
          *,
          product:products(name_en)
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5)

    // Get low stock products
    const { data: lowStockProducts } = await supabase.from("products").select("*").lt("stock", 10).order("stock")

    return NextResponse.json({
      success: true,
      analytics: {
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalAgents: totalAgents || 0,
        totalRevenue,
        categoryBreakdown,
        recentOrders,
        lowStockProducts,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

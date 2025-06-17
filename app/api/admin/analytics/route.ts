import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Initialize default analytics
    const defaultAnalytics = {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      lowStockProducts: 0,
      categoryStats: [],
      recentActivity: [],
    }

    // Check if products table exists
    let tableExists = false
    try {
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'products'
        ) as table_exists
      `
      tableExists = tableCheck[0]?.table_exists || false
    } catch (error) {
      console.error("Error checking table existence:", error)
      return NextResponse.json(defaultAnalytics)
    }

    if (!tableExists) {
      return NextResponse.json(defaultAnalytics)
    }

    // Get total products
    let totalProducts = 0
    try {
      const productCount = await sql`SELECT COUNT(*) as count FROM products`
      totalProducts = Number.parseInt(productCount[0]?.count || "0")
    } catch (error) {
      console.error("Error getting product count:", error)
    }

    // Get low stock products (assuming stock column exists)
    let lowStockProducts = 0
    try {
      const lowStock = await sql`
        SELECT COUNT(*) as count 
        FROM products 
        WHERE stock < 10 AND stock IS NOT NULL
      `
      lowStockProducts = Number.parseInt(lowStock[0]?.count || "0")
    } catch (error) {
      console.error("Error getting low stock count:", error)
    }

    // Get category stats
    let categoryStats = []
    try {
      const categories = await sql`
        SELECT 
          category,
          COUNT(*) as count,
          AVG(price) as avg_price
        FROM products 
        WHERE category IS NOT NULL
        GROUP BY category
        ORDER BY count DESC
      `
      categoryStats = categories.map((cat: any) => ({
        category: cat.category,
        count: Number.parseInt(cat.count),
        avg_price: Number.parseFloat(cat.avg_price || "0"),
      }))
    } catch (error) {
      console.error("Error getting category stats:", error)
    }

    // Generate some recent activity (mock data for now)
    const recentActivity = [
      {
        action: "Product Added",
        item: "New product created",
        timestamp: new Date().toISOString().split("T")[0],
      },
      {
        action: "Database Connected",
        item: "Admin panel initialized",
        timestamp: new Date().toISOString().split("T")[0],
      },
    ]

    return NextResponse.json({
      totalProducts,
      totalOrders: 0, // Will be implemented when orders table is added
      totalRevenue: 0, // Will be calculated from orders
      lowStockProducts,
      categoryStats,
      recentActivity,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      lowStockProducts: 0,
      categoryStats: [],
      recentActivity: [],
    })
  }
}

import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("🔍 Debug: Checking database contents...")

    // First, check if the products table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `

    const exists = tableExists[0]?.exists || false
    console.log(`📋 Products table exists: ${exists}`)

    if (!exists) {
      return NextResponse.json({
        success: true,
        tableExists: false,
        message: "Products table does not exist yet. Use 'Re-Import All Products' to create it.",
        products: [],
        categoryBreakdown: [],
        totalProducts: 0,
        tableStructure: [],
      })
    }

    // Check table structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position;
    `

    // Get all products
    const allProducts = await sql`
      SELECT * FROM products 
      ORDER BY id 
      LIMIT 20;
    `

    // Get count by category
    const categoryCount = await sql`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category;
    `

    // Get total count
    const totalCount = await sql`SELECT COUNT(*) as count FROM products;`

    return NextResponse.json({
      success: true,
      tableExists: true,
      tableStructure: tableInfo,
      products: allProducts,
      categoryBreakdown: categoryCount,
      totalProducts: Number(totalCount[0]?.count || 0),
      message: `Found ${allProducts.length} products in database`,
    })
  } catch (error) {
    console.error("❌ Debug error:", error)

    // Check if it's a "relation does not exist" error
    if (error instanceof Error && error.message.includes('relation "products" does not exist')) {
      return NextResponse.json({
        success: true,
        tableExists: false,
        message: "Products table does not exist. Use 'Re-Import All Products' to create it.",
        products: [],
        categoryBreakdown: [],
        totalProducts: 0,
        tableStructure: [],
      })
    }

    return NextResponse.json(
      {
        success: false,
        tableExists: false,
        error: error instanceof Error ? error.message : "Debug failed",
        products: [],
        categoryBreakdown: [],
        totalProducts: 0,
      },
      { status: 500 },
    )
  }
}

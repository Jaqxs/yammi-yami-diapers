import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("🔍 Checking database status...")

    // Test basic connection
    const connectionTest = await sql`SELECT 1 as test, NOW() as timestamp;`
    console.log("✅ Database connection successful")

    // Check if products table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as table_exists;
    `

    const tableExists = tableCheck[0]?.table_exists || false
    console.log(`📋 Products table exists: ${tableExists}`)

    if (!tableExists) {
      return NextResponse.json({
        success: true,
        status: "connected",
        message: "Database connected but products table doesn't exist yet",
        tableExists: false,
        productCount: 0,
        categoryBreakdown: [],
        sampleProducts: [],
      })
    }

    // Get product count
    const countResult = await sql`SELECT COUNT(*) as count FROM products;`
    const productCount = Number(countResult[0]?.count || 0)

    // Get category breakdown
    const categoryResult = await sql`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category 
      ORDER BY category;
    `

    // Get sample products
    const sampleResult = await sql`
      SELECT id, name_en, category, price, featured, status
      FROM products 
      ORDER BY id 
      LIMIT 5;
    `

    console.log(`📊 Found ${productCount} products in ${categoryResult.length} categories`)

    return NextResponse.json({
      success: true,
      status: "connected",
      message: `Database connected with ${productCount} products`,
      tableExists: true,
      productCount,
      categoryBreakdown: categoryResult.map((cat) => ({
        category: cat.category,
        count: Number(cat.count),
      })),
      sampleProducts: sampleResult,
    })
  } catch (error) {
    console.error("❌ Database status error:", error)

    // Handle specific "relation does not exist" error
    if (error instanceof Error && error.message.includes('relation "products" does not exist')) {
      return NextResponse.json({
        success: true,
        status: "connected",
        message: "Database connected but products table doesn't exist yet",
        tableExists: false,
        productCount: 0,
        categoryBreakdown: [],
        sampleProducts: [],
      })
    }

    // Handle connection errors
    if (error instanceof Error && error.message.includes("connect")) {
      return NextResponse.json(
        {
          success: false,
          status: "error",
          message: "Cannot connect to database. Check your DATABASE_URL environment variable.",
          tableExists: false,
          productCount: 0,
          categoryBreakdown: [],
          sampleProducts: [],
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        status: "error",
        message: error instanceof Error ? error.message : "Unknown database error",
        tableExists: false,
        productCount: 0,
        categoryBreakdown: [],
        sampleProducts: [],
      },
      { status: 500 },
    )
  }
}

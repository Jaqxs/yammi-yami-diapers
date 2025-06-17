import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("🔍 Debug: Checking products in database...")

    // Check if the products table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      );
    `

    const tableExists = tableCheck[0]?.exists || false

    if (!tableExists) {
      return NextResponse.json({
        success: false,
        error: "Products table does not exist",
        tableExists: false,
      })
    }

    // Get all products
    const allProducts = await sql`
      SELECT * FROM products 
      ORDER BY id 
      LIMIT 20;
    `

    // Get count of products
    const countResult = await sql`SELECT COUNT(*) as count FROM products;`
    const totalCount = countResult[0]?.count || 0

    // Get sample of each column to check data types
    const sampleData = await sql`
      SELECT 
        id, name_en, name_sw, price, category, 
        tags, featured, status, image_url
      FROM products 
      LIMIT 1;
    `

    return NextResponse.json({
      success: true,
      tableExists,
      totalCount,
      sampleProduct: sampleData[0] || null,
      allProducts,
      connectionString: process.env.DATABASE_URL ? "Set (masked for security)" : "Not set",
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error("❌ Debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Debug failed",
        connectionString: process.env.DATABASE_URL ? "Set (masked for security)" : "Not set",
      },
      { status: 500 },
    )
  }
}

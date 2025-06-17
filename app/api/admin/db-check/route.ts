import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Check if products table exists and get its structure
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `

    // Check if table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      )
    `

    return NextResponse.json({
      tableExists: tableExists[0].exists,
      columns: tableInfo,
      requiredColumns: ["id", "name_en", "name_sw", "price", "category", "image_url", "created_at"],
    })
  } catch (error) {
    console.error("Error checking database:", error)
    return NextResponse.json({ error: "Failed to check database structure" }, { status: 500 })
  }
}

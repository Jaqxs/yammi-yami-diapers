import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST(request: Request) {
  try {
    const { connectionString } = await request.json()

    if (!connectionString) {
      return NextResponse.json(
        {
          success: false,
          error: "No connection string provided",
        },
        { status: 400 },
      )
    }

    // Test the connection
    const sql = neon(connectionString)

    // Simple test query
    const result = await sql`SELECT 1 as test, NOW() as timestamp;`

    // Check if we can create tables (test permissions)
    await sql`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        test_value TEXT
      );
    `

    // Clean up test table
    await sql`DROP TABLE IF EXISTS connection_test;`

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      timestamp: result[0].timestamp,
      permissions: "Full access confirmed",
    })
  } catch (error) {
    console.error("Connection test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown connection error",
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    console.log("🔍 Testing database connection...")

    // Check environment variable
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: "DATABASE_URL environment variable is not set",
        checks: {
          envVar: false,
          connection: false,
          query: false,
        },
      })
    }

    console.log("✅ DATABASE_URL found")

    // Test connection
    const sql = neon(process.env.DATABASE_URL)

    const startTime = Date.now()
    const result = await Promise.race([
      sql`SELECT 1 as test, NOW() as timestamp, version() as db_version;`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 15000)),
    ])
    const connectionTime = Date.now() - startTime

    console.log("✅ Database connection successful")

    // Test table check query
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      checks: {
        envVar: true,
        connection: true,
        query: true,
      },
      details: {
        connectionTime: `${connectionTime}ms`,
        timestamp: result[0].timestamp,
        dbVersion: result[0].db_version,
        existingTables: tableCheck.map((t) => t.table_name),
        tableCount: tableCheck.length,
      },
    })
  } catch (error) {
    console.error("❌ Database connection test failed:", error)

    let errorType = "unknown"
    if (error instanceof Error) {
      if (error.message.includes("timeout")) errorType = "timeout"
      else if (error.message.includes("connect")) errorType = "connection"
      else if (error.message.includes("auth")) errorType = "authentication"
      else if (error.message.includes("permission")) errorType = "permission"
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      errorType,
      checks: {
        envVar: !!process.env.DATABASE_URL,
        connection: false,
        query: false,
      },
      suggestion: getSuggestion(errorType),
    })
  }
}

function getSuggestion(errorType: string): string {
  switch (errorType) {
    case "timeout":
      return "Your Neon database might be sleeping. Try again in a moment, or check if your database is active."
    case "connection":
      return "Cannot connect to database. Verify your DATABASE_URL is correct and your database is accessible."
    case "authentication":
      return "Authentication failed. Check your database username and password in the connection string."
    case "permission":
      return "Permission denied. Ensure your database user has the necessary permissions."
    default:
      return "Check your DATABASE_URL environment variable and ensure your Neon database is properly configured."
  }
}

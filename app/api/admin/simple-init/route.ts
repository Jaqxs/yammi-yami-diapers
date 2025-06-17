import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function POST() {
  try {
    console.log("🚀 Simple database initialization...")

    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL environment variable is not set",
          suggestion: "Add your Neon database URL to the environment variables",
        },
        { status: 400 },
      )
    }

    const sql = neon(process.env.DATABASE_URL)

    // Test connection with timeout
    console.log("🔍 Testing database connection...")
    const connectionTest = await Promise.race([
      sql`SELECT 1 as test, NOW() as timestamp;`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout after 10 seconds")), 10000)),
    ])

    console.log("✅ Database connection successful")

    // Check if products table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists;
    `

    const tableExists = tableCheck[0]?.exists

    if (tableExists) {
      const count = await sql`SELECT COUNT(*) as count FROM products;`
      return NextResponse.json({
        success: true,
        message: `Products table already exists with ${count[0]?.count || 0} products`,
        tableExists: true,
        productCount: Number(count[0]?.count || 0),
      })
    }

    // Create simple products table
    console.log("🏗️ Creating products table...")
    await sql`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_sw VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_sw TEXT,
        price DECIMAL(10, 2) NOT NULL,
        wholesale_price DECIMAL(10, 2),
        category VARCHAR(50) NOT NULL,
        size VARCHAR(50),
        bundle_size INTEGER,
        carton_size VARCHAR(100),
        weight_range VARCHAR(50),
        hip_size VARCHAR(50),
        stock INTEGER DEFAULT 100,
        featured BOOLEAN DEFAULT false,
        status VARCHAR(20) DEFAULT 'active',
        image_url TEXT,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create basic indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`
    await sql`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);`
    await sql`CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);`

    console.log("✅ Products table created successfully")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully. Products table created.",
      tableExists: true,
      productCount: 0,
    })
  } catch (error) {
    console.error("❌ Database initialization error:", error)

    let errorMessage = "Failed to initialize database"
    let suggestion = "Please check the server logs for more details"

    if (error instanceof Error) {
      errorMessage = error.message

      if (error.message.includes("Connection timeout")) {
        suggestion = "Database connection timed out. Your Neon database might be sleeping. Try again in a moment."
      } else if (error.message.includes("connect")) {
        suggestion = "Cannot connect to database. Check your DATABASE_URL environment variable."
      } else if (error.message.includes("permission")) {
        suggestion = "Database permission denied. Check your database user permissions."
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        suggestion,
        tableExists: false,
        productCount: 0,
      },
      { status: 500 },
    )
  }
}

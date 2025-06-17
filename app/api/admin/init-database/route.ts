import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("🚀 Initializing database...")

    // Test connection first
    await sql`SELECT 1;`
    console.log("✅ Database connection verified")

    // Check if table already exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists;
    `

    if (tableCheck[0]?.exists) {
      const count = await sql`SELECT COUNT(*) as count FROM products;`
      return NextResponse.json({
        success: true,
        message: `Products table already exists with ${count[0]?.count || 0} products`,
        tableExists: true,
        productCount: Number(count[0]?.count || 0),
      })
    }

    // Create the products table
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

    // Create indexes for better performance
    await sql`CREATE INDEX idx_products_category ON products(category);`
    await sql`CREATE INDEX idx_products_featured ON products(featured);`
    await sql`CREATE INDEX idx_products_status ON products(status);`

    console.log("✅ Products table created successfully")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully. Products table created.",
      tableExists: true,
      productCount: 0,
    })
  } catch (error) {
    console.error("❌ Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to initialize database",
        tableExists: false,
        productCount: 0,
      },
      { status: 500 },
    )
  }
}

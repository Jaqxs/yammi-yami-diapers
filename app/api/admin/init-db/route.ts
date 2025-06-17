import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { mockProducts } from "@/data/mock-products"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("🚀 Starting database initialization...")

    // First, create the products table with the correct schema
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name_en TEXT NOT NULL,
        name_sw TEXT NOT NULL,
        description_en TEXT DEFAULT '',
        description_sw TEXT DEFAULT '',
        price DECIMAL(10, 2) NOT NULL,
        wholesale_price DECIMAL(10, 2),
        category TEXT NOT NULL,
        size TEXT,
        bundle_size INTEGER,
        carton_size TEXT,
        weight_range TEXT,
        hip_size TEXT,
        stock INTEGER DEFAULT 100,
        featured BOOLEAN DEFAULT false,
        status TEXT DEFAULT 'active',
        image_url TEXT DEFAULT '',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Clear existing products to avoid duplicates
    await sql`DELETE FROM products`
    console.log("🗑️ Cleared existing products")

    console.log(`📦 Importing ${mockProducts.length} products...`)

    // Import all products from mock data
    let importedCount = 0
    const errors = []

    for (const product of mockProducts) {
      try {
        // Handle tags properly - convert array to PostgreSQL array format
        const tagsArray = Array.isArray(product.tags) ? product.tags : []

        // Handle image URL
        const imageUrl = product.image || ""

        // Handle wholesale price
        const wholesalePrice = product.wholesalePrice || null

        // Handle bundle size
        const bundleSize = product.bundleSize || 50

        // Handle carton size
        const cartonSize = product.cartonSize ? String(product.cartonSize) : null

        // Handle stock
        const stock = product.stock || 100

        // Handle featured status
        const featured = product.featured || false

        // Handle status
        const status = product.status || "active"

        await sql`
          INSERT INTO products (
            name_en, name_sw, description_en, description_sw,
            price, wholesale_price, category, size, bundle_size, carton_size,
            weight_range, hip_size, stock, featured, status, image_url, tags
          ) VALUES (
            ${product.name.en || ""},
            ${product.name.sw || ""},
            ${product.description?.en || ""},
            ${product.description?.sw || ""},
            ${product.price || 0},
            ${wholesalePrice},
            ${product.category || "babyDiapers"},
            ${product.size || null},
            ${bundleSize},
            ${cartonSize},
            ${product.weightRange || null},
            ${product.hipSize || null},
            ${stock},
            ${featured},
            ${status},
            ${imageUrl},
            ${tagsArray}
          )
        `

        importedCount++
        console.log(`✅ Imported: ${product.name.en} (ID: ${product.id})`)
      } catch (error) {
        console.error(`❌ Error importing ${product.name?.en}:`, error)
        errors.push({
          product: product.name?.en || "Unknown",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    // Get final count from database
    const result = await sql`SELECT COUNT(*) as count FROM products`
    const finalCount = result[0]?.count || 0

    console.log(`🎉 Import completed: ${importedCount}/${mockProducts.length} products imported`)

    // Get all imported products for verification
    const allProducts = await sql`
      SELECT id, name_en, name_sw, price, category, featured, stock, status 
      FROM products 
      ORDER BY id ASC
    `

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importedCount} products`,
      imported: importedCount,
      total: mockProducts.length,
      finalCount: Number(finalCount),
      products: allProducts.map((p) => ({
        id: p.id,
        name_en: p.name_en,
        name_sw: p.name_sw,
        price: Number(p.price),
        category: p.category,
        featured: p.featured,
        stock: p.stock,
        status: p.status,
      })),
      errors: errors.length > 0 ? errors : null,
    })
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

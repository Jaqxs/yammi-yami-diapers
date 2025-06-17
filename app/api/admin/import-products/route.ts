import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("🔄 Starting product import process...")

    // First, let's check if we can connect to the database
    const connectionTest = await sql`SELECT 1 as test;`
    console.log("✅ Database connection successful")

    // Check if products table exists, if not create it
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'products'
      );
    `

    const tableExists = tableCheck[0]?.exists

    if (!tableExists) {
      console.log("⚠️ Products table doesn't exist, creating it...")

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
      console.log("✅ Products table created successfully")
    }

    // Clear existing products
    await sql`DELETE FROM products;`
    await sql`ALTER SEQUENCE products_id_seq RESTART WITH 1;`
    console.log("🗑️ Cleared existing products")

    // Import mock products
    const { mockProducts } = await import("@/data/mock-products")
    console.log(`📦 Found ${mockProducts.length} products to import`)

    let importedCount = 0

    for (const product of mockProducts) {
      try {
        console.log(`📝 Importing: ${product.name.en}`)

        const result = await sql`
          INSERT INTO products (
            name_en, name_sw, category, price, wholesale_price, 
            size, bundle_size, carton_size, weight_range, hip_size,
            image_url, tags, description_en, description_sw, 
            stock, status, featured
          ) VALUES (
            ${product.name.en},
            ${product.name.sw},
            ${product.category},
            ${product.price},
            ${product.wholesalePrice || null},
            ${product.size || null},
            ${product.bundleSize || null},
            ${product.cartonSize?.toString() || null},
            ${product.weightRange || null},
            ${product.hipSize || null},
            ${product.image || null},
            ${product.tags || []},
            ${product.description?.en || null},
            ${product.description?.sw || null},
            ${product.stock || 100},
            ${product.status || "active"},
            ${product.featured || false}
          )
          RETURNING id, name_en;
        `

        console.log(`✅ Imported: ${result[0].name_en} (ID: ${result[0].id})`)
        importedCount++
      } catch (productError) {
        console.error(`❌ Failed to import ${product.name.en}:`, productError)
      }
    }

    // Verify import
    const finalCount = await sql`SELECT COUNT(*) as count FROM products;`
    const actualCount = Number(finalCount[0]?.count || 0)

    console.log(`🎉 Import complete! ${importedCount} products imported, ${actualCount} in database`)

    // Get sample of imported products for verification
    const sampleProducts = await sql`
      SELECT id, name_en, name_sw, category, price 
      FROM products 
      LIMIT 5;
    `

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${actualCount} products to the database`,
      count: actualCount,
      importedCount,
      sampleProducts,
    })
  } catch (error) {
    console.error("❌ Error during product import:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during product import",
        details: error instanceof Error ? error.stack : "No stack trace available",
      },
      { status: 500 },
    )
  }
}

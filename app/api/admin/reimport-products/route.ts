import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("🔄 Starting COMPLETE product re-import process...")

    // Test database connection first with better error handling
    try {
      const connectionTest = await sql`SELECT 1 as test, NOW() as timestamp;`
      console.log("✅ Database connection successful:", connectionTest[0])
    } catch (connectionError) {
      console.error("❌ Database connection failed:", connectionError)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: connectionError instanceof Error ? connectionError.message : "Unknown connection error",
          suggestion: "Check your DATABASE_URL environment variable and ensure your Neon database is accessible",
        },
        { status: 500 },
      )
    }

    // Check if products table exists, if not create it
    console.log("🔍 Checking if products table exists...")
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists;
    `

    const tableExists = tableCheck[0]?.exists
    console.log(`📋 Products table exists: ${tableExists}`)

    if (!tableExists) {
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
      console.log("✅ Products table created")
    } else {
      // Clear existing products for clean import
      console.log("🗑️ Clearing existing products...")
      await sql`DELETE FROM products;`
      console.log("✅ Existing products cleared")
    }

    // Import mock products with better error handling
    const { mockProducts } = await import("@/data/mock-products")
    console.log(`📦 Found ${mockProducts.length} products to import`)

    let importedCount = 0
    const importResults = []
    const failedImports = []

    for (const [index, product] of mockProducts.entries()) {
      try {
        console.log(`📝 Importing ${index + 1}/${mockProducts.length}: ${product.name.en}`)

        // Validate required fields
        if (!product.name?.en || !product.name?.sw || !product.price || !product.category) {
          throw new Error(`Missing required fields for product: ${product.name?.en || "Unknown"}`)
        }

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
          RETURNING id, name_en, category, price;
        `

        const imported = result[0]
        console.log(`✅ Successfully imported: ${imported.name_en} (ID: ${imported.id})`)
        importResults.push({
          success: true,
          id: imported.id,
          name: imported.name_en,
          category: imported.category,
          price: imported.price,
        })
        importedCount++
      } catch (productError) {
        console.error(`❌ Failed to import ${product.name?.en || "Unknown"}:`, productError)
        failedImports.push({
          name: product.name?.en || "Unknown",
          error: productError instanceof Error ? productError.message : "Unknown error",
        })
      }
    }

    // Verify import with detailed breakdown
    const finalCount = await sql`SELECT COUNT(*) as count FROM products;`
    const actualCount = Number(finalCount[0]?.count || 0)

    const categoryBreakdown = await sql`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category 
      ORDER BY category;
    `

    const featuredCount = await sql`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE featured = true;
    `

    // Get sample of imported products for verification
    const sampleProducts = await sql`
      SELECT id, name_en, name_sw, category, price, featured, status, image_url
      FROM products 
      ORDER BY id
      LIMIT 5;
    `

    console.log(`🎉 Import complete! ${importedCount} products imported, ${actualCount} in database`)

    if (failedImports.length > 0) {
      console.log(`⚠️ ${failedImports.length} products failed to import:`, failedImports)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${actualCount} products to the database`,
      stats: {
        totalProducts: actualCount,
        importedCount,
        failedCount: failedImports.length,
        featuredProducts: Number(featuredCount[0]?.count || 0),
        categoryBreakdown: categoryBreakdown.map((cat) => ({
          category: cat.category,
          count: Number(cat.count),
        })),
      },
      sampleProducts,
      importResults: importResults.slice(0, 5), // Show first 5 successful imports
      failedImports: failedImports.slice(0, 3), // Show first 3 failures
    })
  } catch (error) {
    console.error("❌ Critical error during product import:", error)

    // Provide more specific error information
    let errorMessage = "Unknown error during product import"
    let suggestion = "Please check the server logs for more details"

    if (error instanceof Error) {
      errorMessage = error.message

      if (error.message.includes("connect")) {
        suggestion = "Database connection failed. Check your DATABASE_URL environment variable."
      } else if (error.message.includes("relation") && error.message.includes("does not exist")) {
        suggestion = "Products table doesn't exist. Try running 'Setup Complete Database' first."
      } else if (error.message.includes("permission")) {
        suggestion = "Database permission denied. Check your database user permissions."
      } else if (error.message.includes("timeout")) {
        suggestion = "Database connection timeout. Your database might be sleeping or overloaded."
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        suggestion,
        details: error instanceof Error ? error.stack : "No stack trace available",
      },
      { status: 500 },
    )
  }
}

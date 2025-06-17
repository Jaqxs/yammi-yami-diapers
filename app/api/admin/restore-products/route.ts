import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { mockProducts } from "@/data/mock-products"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("🔄 Restoring original products to database...")
    console.log(`📦 Found ${mockProducts.length} products to restore`)

    // Clear existing products
    await sql`DELETE FROM products`
    console.log("🗑️ Cleared existing products")

    // Insert all original mock products with proper error handling
    for (let i = 0; i < mockProducts.length; i++) {
      const product = mockProducts[i]

      try {
        // Validate product structure
        if (!product) {
          console.warn(`⚠️ Skipping undefined product at index ${i}`)
          continue
        }

        if (!product.name || !product.name.en || !product.name.sw) {
          console.warn(`⚠️ Skipping product ${product.id} - missing name`)
          continue
        }

        if (!product.description || !product.description.en || !product.description.sw) {
          console.warn(`⚠️ Skipping product ${product.id} - missing description`)
          continue
        }

        console.log(`📝 Inserting product: ${product.name.en}`)

        await sql`
          INSERT INTO products (
            id, name_en, name_sw, description_en, description_sw,
            price, wholesale_price, category, size, bundle_size,
            carton_size, weight_range, hip_size, stock, featured,
            status, image_url, tags
          ) VALUES (
            ${product.id},
            ${product.name.en},
            ${product.name.sw},
            ${product.description.en},
            ${product.description.sw},
            ${product.price},
            ${product.wholesalePrice || null},
            ${product.category},
            ${product.size || null},
            ${product.bundleSize || null},
            ${product.cartonSize || null},
            ${product.weightRange || null},
            ${product.hipSize || null},
            ${product.stock || 100},
            ${product.featured || false},
            ${product.status || "active"},
            ${product.image || null},
            ${JSON.stringify(product.tags || [])}
          )
        `

        console.log(`✅ Successfully inserted: ${product.name.en}`)
      } catch (productError) {
        console.error(`❌ Error inserting product ${product.id}:`, productError)
        console.error(`Product data:`, JSON.stringify(product, null, 2))
        // Continue with next product instead of failing completely
        continue
      }
    }

    // Verify insertion
    const insertedProducts = await sql`SELECT COUNT(*) as count FROM products`
    const count = insertedProducts[0]?.count || 0

    console.log(`✅ Successfully restored ${count} original products`)

    return NextResponse.json({
      success: true,
      message: `Restored ${count} original products`,
      products: count,
    })
  } catch (error) {
    console.error("❌ Error restoring products:", error)

    // Provide more detailed error information
    return NextResponse.json(
      {
        success: false,
        error: "Failed to restore products",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

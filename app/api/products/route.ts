import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { mockProducts } from "@/data/mock-products"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("🔍 Attempting to fetch products from database...")

    // Try to fetch from database first
    const dbProducts = await sql`
      SELECT 
        id,
        name_en,
        name_sw,
        description_en,
        description_sw,
        price,
        wholesale_price,
        category,
        size,
        bundle_size,
        carton_size,
        weight_range,
        hip_size,
        stock,
        featured,
        status,
        image_url,
        tags,
        created_at,
        updated_at
      FROM products 
      ORDER BY featured DESC, id ASC
    `

    console.log(`📊 Database returned ${dbProducts.length} products`)

    if (dbProducts && dbProducts.length > 0) {
      // Transform database products to match frontend format
      const transformedProducts = dbProducts.map((product) => ({
        id: product.id,
        name: {
          en: product.name_en || "",
          sw: product.name_sw || "",
        },
        description: {
          en: product.description_en || "",
          sw: product.description_sw || "",
        },
        price: Number(product.price) || 0,
        wholesalePrice: product.wholesale_price ? Number(product.wholesale_price) : undefined,
        category: product.category || "babyDiapers",
        size: product.size || undefined,
        bundleSize: product.bundle_size || undefined,
        cartonSize: product.carton_size || undefined,
        weightRange: product.weight_range || undefined,
        hipSize: product.hip_size || undefined,
        stock: product.stock || 0,
        featured: Boolean(product.featured),
        status: product.status || "active",
        image: product.image_url || undefined,
        tags: Array.isArray(product.tags)
          ? product.tags
          : typeof product.tags === "string"
            ? JSON.parse(product.tags)
            : [],
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      }))

      console.log(`✅ Successfully transformed ${transformedProducts.length} products`)

      return NextResponse.json({
        success: true,
        products: transformedProducts,
        source: "database",
        count: transformedProducts.length,
      })
    } else {
      console.log("⚠️ No products found in database, falling back to mock data")
      throw new Error("No products found in database")
    }
  } catch (error) {
    console.error("❌ Database error, falling back to mock data:", error)

    // Fallback to mock data
    return NextResponse.json({
      success: true,
      products: mockProducts,
      source: "fallback",
      count: mockProducts.length,
      warning: "Using fallback data - database connection failed",
    })
  }
}

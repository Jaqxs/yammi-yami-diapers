import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")

    console.log("🔍 Fetching products from database...")

    // Check if products table exists first
    const tableCheckResult = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `

    const tableExists = tableCheckResult[0]?.exists

    if (!tableExists) {
      console.log("⚠️ Products table doesn't exist")
      return NextResponse.json({
        success: false,
        error: "Products table doesn't exist. Please import products first.",
        products: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
      })
    }

    // Build WHERE clause dynamically
    let whereClause = ""
    const conditions = []

    if (category && category !== "all") {
      conditions.push(`category = '${category}'`)
    }

    if (status && status !== "all") {
      conditions.push(`status = '${status}'`)
    }

    if (featured === "true") {
      conditions.push(`featured = true`)
    }

    if (search) {
      conditions.push(`(name_en ILIKE '%${search}%' OR name_sw ILIKE '%${search}%')`)
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`
    const countResult = await sql.unsafe(countQuery)
    const total = Number(countResult[0]?.total || 0)

    // Calculate offset
    const offset = (page - 1) * limit

    // Get products with pagination
    const productsQuery = `
      SELECT 
        id, name_en, name_sw, description_en, description_sw,
        price, wholesale_price, category, size, bundle_size, carton_size,
        weight_range, hip_size, stock, featured, status, image_url, tags,
        created_at, updated_at
      FROM products 
      ${whereClause}
      ORDER BY 
        CASE WHEN featured = true THEN 0 ELSE 1 END,
        created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const productsResult = await sql.unsafe(productsQuery)

    // Ensure we have an array
    const productsArray = Array.isArray(productsResult) ? productsResult : []

    console.log(`✅ Found ${productsArray.length} products in database`)

    // Transform products to match frontend format
    const transformedProducts = productsArray.map((product: any) => {
      // Handle tags - convert from PostgreSQL array format
      let tags = []
      if (product.tags) {
        if (Array.isArray(product.tags)) {
          tags = product.tags
        } else if (typeof product.tags === "string") {
          // Handle PostgreSQL array string format like {tag1,tag2}
          tags = product.tags.replace(/[{}]/g, "").split(",").filter(Boolean)
        }
      }

      return {
        id: Number(product.id),
        name_en: product.name_en || "",
        name_sw: product.name_sw || "",
        description_en: product.description_en || "",
        description_sw: product.description_sw || "",
        price: Number(product.price) || 0,
        wholesale_price: product.wholesale_price ? Number(product.wholesale_price) : null,
        category: product.category || "",
        size: product.size || null,
        bundle_size: product.bundle_size ? Number(product.bundle_size) : null,
        carton_size: product.carton_size ? Number(product.carton_size) : null,
        weight_range: product.weight_range || null,
        hip_size: product.hip_size || null,
        stock: Number(product.stock) || 0,
        featured: Boolean(product.featured),
        status: product.status || "active",
        image_url: product.image_url || "",
        tags: tags,
        created_at: product.created_at,
        updated_at: product.updated_at,
      }
    })

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      source: "database",
    })
  } catch (error) {
    console.error("❌ Error fetching products:", error)

    // Return empty array instead of undefined to prevent map error
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : "Unknown error",
        products: [], // Always return an array
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      name_en,
      name_sw,
      description_en = "",
      description_sw = "",
      price,
      wholesale_price,
      category,
      size,
      bundle_size,
      carton_size,
      weight_range,
      hip_size,
      stock = 100,
      featured = false,
      status = "active",
      image_url = "",
      tags = [],
    } = body

    // Validate required fields
    if (!name_en || !name_sw || !price || !category) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: name_en, name_sw, price, category",
        },
        { status: 400 },
      )
    }

    // Insert new product
    const result = await sql`
      INSERT INTO products (
        name_en, name_sw, description_en, description_sw,
        price, wholesale_price, category, size, bundle_size, carton_size,
        weight_range, hip_size, stock, featured, status, image_url, tags
      ) VALUES (
        ${name_en}, ${name_sw}, ${description_en}, ${description_sw},
        ${price}, ${wholesale_price || null}, ${category}, ${size || null},
        ${bundle_size || null}, ${carton_size || null}, ${weight_range || null},
        ${hip_size || null}, ${stock}, ${featured}, ${status}, ${image_url}, ${tags}
      )
      RETURNING *
    `

    const newProduct = result[0]

    console.log(`✅ Created new product: ${newProduct.name_en}`)

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product: {
        id: newProduct.id,
        name_en: newProduct.name_en,
        name_sw: newProduct.name_sw,
        description_en: newProduct.description_en,
        description_sw: newProduct.description_sw,
        price: Number(newProduct.price),
        wholesale_price: newProduct.wholesale_price ? Number(newProduct.wholesale_price) : null,
        category: newProduct.category,
        size: newProduct.size,
        bundle_size: newProduct.bundle_size,
        carton_size: newProduct.carton_size,
        weight_range: newProduct.weight_range,
        hip_size: newProduct.hip_size,
        stock: Number(newProduct.stock),
        featured: Boolean(newProduct.featured),
        status: newProduct.status,
        image_url: newProduct.image_url,
        tags: newProduct.tags || [],
        created_at: newProduct.created_at,
        updated_at: newProduct.updated_at,
      },
    })
  } catch (error) {
    console.error("❌ Error creating product:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

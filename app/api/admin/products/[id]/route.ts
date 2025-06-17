import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const result = await sql`
      SELECT p.*, c.name_en as category_name_en, c.name_sw as category_name_sw
      FROM products p
      LEFT JOIN categories c ON p.category = c.name_en
      WHERE p.id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const {
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
    } = body

    const result = await sql`
      UPDATE products SET
        name_en = ${name_en},
        name_sw = ${name_sw},
        description_en = ${description_en},
        description_sw = ${description_sw},
        price = ${price},
        wholesale_price = ${wholesale_price},
        category = ${category},
        size = ${size},
        bundle_size = ${bundle_size},
        carton_size = ${carton_size},
        weight_range = ${weight_range},
        hip_size = ${hip_size},
        stock = ${stock},
        featured = ${featured},
        status = ${status},
        image_url = ${image_url},
        tags = ${tags},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const result = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

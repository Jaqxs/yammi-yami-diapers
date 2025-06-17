import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const categories = await sql`
      SELECT * FROM categories ORDER BY name_en
    `

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name_en, name_sw, description_en, description_sw } = body

    const result = await sql`
      INSERT INTO categories (name_en, name_sw, description_en, description_sw)
      VALUES (${name_en}, ${name_sw}, ${description_en}, ${description_sw})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

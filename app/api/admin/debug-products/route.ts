import { NextResponse } from "next/server"
import { mockProducts } from "@/data/mock-products"

export async function GET() {
  try {
    console.log("🔍 Debugging mock products...")

    const productSummary = mockProducts.map((product, index) => ({
      index,
      id: product?.id,
      hasName: !!product?.name,
      nameEn: product?.name?.en,
      nameSw: product?.name?.sw,
      hasDescription: !!product?.description,
      descriptionEn: product?.description?.en?.substring(0, 50) + "...",
      price: product?.price,
      category: product?.category,
      image: product?.image?.substring(0, 50) + "...",
    }))

    return NextResponse.json({
      success: true,
      totalProducts: mockProducts.length,
      products: productSummary,
      firstProduct: mockProducts[0],
    })
  } catch (error) {
    console.error("❌ Error debugging products:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to debug products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

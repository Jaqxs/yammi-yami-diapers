import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("🚀 Setting up live database...")

    // Drop existing table and recreate
    await sql`DROP TABLE IF EXISTS products CASCADE`

    // Create products table
    await sql`
      CREATE TABLE products (
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

    // Create indexes
    await sql`CREATE INDEX idx_products_category ON products(category)`
    await sql`CREATE INDEX idx_products_featured ON products(featured)`
    await sql`CREATE INDEX idx_products_status ON products(status)`
    await sql`CREATE INDEX idx_products_price ON products(price)`

    console.log("✅ Database schema created")

    // Insert all products
    const products = [
      // Baby Diapers - Side Tape
      {
        name_en: "Baby Diapers Side Tape - Small (S)",
        name_sw: "Diapers za Watoto Side Tape - Ndogo (S)",
        description_en:
          "Premium baby diapers with side tape closure for secure fit. Perfect for newborns and small babies.",
        description_sw:
          "Diapers bora za watoto zenye utepe wa pembeni kwa usalama zaidi. Nzuri kwa watoto wachanga na wadogo.",
        price: 18000.0,
        wholesale_price: 16000.0,
        category: "babyDiapers",
        size: "small",
        bundle_size: 50,
        carton_size: "4 bundles (200 pieces)",
        weight_range: "4-8kg",
        stock: 120,
        featured: true,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg",
        tags: ["bestSeller", "sideTape"],
      },
      {
        name_en: "Baby Diapers Side Tape - Medium (M)",
        name_sw: "Diapers za Watoto Side Tape - Wastani (M)",
        description_en: "Medium size baby diapers with side tape for growing babies. Excellent absorption and comfort.",
        description_sw:
          "Diapers za ukubwa wa wastani zenye utepe wa pembeni kwa watoto wanaokua. Unyonywaji na faraja bora.",
        price: 18000.0,
        wholesale_price: 16000.0,
        category: "babyDiapers",
        size: "medium",
        bundle_size: 48,
        carton_size: "4 bundles (192 pieces)",
        weight_range: "6-11kg",
        stock: 95,
        featured: true,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg",
        tags: ["bestSeller", "sideTape"],
      },
      {
        name_en: "Baby Diapers Side Tape - Large (L)",
        name_sw: "Diapers za Watoto Side Tape - Kubwa (L)",
        description_en: "Large size baby diapers with side tape for active toddlers. Superior protection and comfort.",
        description_sw:
          "Diapers za ukubwa mkubwa zenye utepe wa pembeni kwa watoto wanaocheza. Ulinzi na faraja ya hali ya juu.",
        price: 18000.0,
        wholesale_price: 16000.0,
        category: "babyDiapers",
        size: "large",
        bundle_size: 44,
        carton_size: "4 bundles (176 pieces)",
        weight_range: "9-14kg",
        stock: 80,
        featured: false,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg",
        tags: ["bestSeller", "sideTape"],
      },
      {
        name_en: "Baby Diapers Side Tape - Extra Large (XL)",
        name_sw: "Diapers za Watoto Side Tape - Kubwa Zaidi (XL)",
        description_en: "Extra large baby diapers with side tape for bigger toddlers. Maximum absorption and security.",
        description_sw:
          "Diapers za ukubwa mkubwa zaidi zenye utepe wa pembeni kwa watoto wakubwa. Unyonywaji na usalama wa hali ya juu.",
        price: 18000.0,
        wholesale_price: 16000.0,
        category: "babyDiapers",
        size: "extraLarge",
        bundle_size: 40,
        carton_size: "4 bundles (160 pieces)",
        weight_range: "12-17kg",
        stock: 65,
        featured: false,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg",
        tags: ["sideTape"],
      },
      // Baby Pull-up Pants
      {
        name_en: "Baby Pull-up Pants - Medium (M)",
        name_sw: "Pants za Watoto - Wastani (M)",
        description_en:
          "Easy-to-wear pull-up pants for active babies. Japan standard quality with superior absorption.",
        description_sw: "Pants rahisi kuvaa kwa watoto wanaocheza. Ubora wa kiwango cha Japani na unyonywaji bora.",
        price: 20000.0,
        wholesale_price: 17000.0,
        category: "babyPants",
        size: "medium",
        bundle_size: 50,
        carton_size: "4 bundles (200 pieces)",
        weight_range: "6-11kg",
        stock: 85,
        featured: true,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1012.jpg-ES0dluaBooNTot5s1D4osLe125JMM4.jpeg",
        tags: ["japanStandard", "pullUp"],
      },
      {
        name_en: "Baby Pull-up Pants - Large (L)",
        name_sw: "Pants za Watoto - Kubwa (L)",
        description_en: "Large pull-up pants for growing toddlers. Easy to put on and take off with excellent fit.",
        description_sw: "Pants za ukubwa mkubwa kwa watoto wanaokua. Rahisi kuvaa na kuvua na urafiki mzuri.",
        price: 20000.0,
        wholesale_price: 17000.0,
        category: "babyPants",
        size: "large",
        bundle_size: 50,
        carton_size: "4 bundles (200 pieces)",
        weight_range: "9-14kg",
        stock: 70,
        featured: false,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1016.jpg-N7AFkyLYxdcxtB9xZpOyAB7xo2TYYZ.jpeg",
        tags: ["bestSeller", "pullUp"],
      },
      {
        name_en: "Baby Pull-up Pants - Extra Large (XL)",
        name_sw: "Pants za Watoto - Kubwa Zaidi (XL)",
        description_en:
          "Extra large pull-up pants for bigger toddlers. Premium quality with maximum comfort and protection.",
        description_sw:
          "Pants za ukubwa mkubwa zaidi kwa watoto wakubwa. Ubora wa hali ya juu na faraja na ulinzi wa hali ya juu.",
        price: 20000.0,
        wholesale_price: 17000.0,
        category: "babyPants",
        size: "extraLarge",
        bundle_size: 50,
        carton_size: "4 bundles (200 pieces)",
        weight_range: "12-17kg",
        stock: 55,
        featured: false,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1009.jpg-BIK0Z64A1WCzCs1Id2cgiGSKGHHL2Z.jpeg",
        tags: ["japanStandard", "pullUp"],
      },
      // Premium Royal Baby Pants
      {
        name_en: "Premium Royal Baby Pants - Large (L)",
        name_sw: "Pants Bora za Kifalme za Watoto - Kubwa (L)",
        description_en:
          "Our highest quality royal pants with premium absorption and extra softness. Royal quality for your baby.",
        description_sw:
          "Pants zetu za ubora wa juu zaidi za kifalme zenye unyonywaji wa hali ya juu na ulaini wa ziada. Ubora wa kifalme kwa mtoto wako.",
        price: 22000.0,
        wholesale_price: 19000.0,
        category: "babyPants",
        size: "large",
        bundle_size: 50,
        carton_size: "4 bundles (200 pieces)",
        weight_range: "9-14kg",
        stock: 40,
        featured: true,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1011.jpg-kyHylrVCgJKZGHSxfOAMQ6GEz7jRUZ.jpeg",
        tags: ["bestSeller", "premium", "royal"],
      },
      // Adult Diapers/Pants
      {
        name_en: "Adult Pants - Large (L)",
        name_sw: "Pants za Watu Wazima - Kubwa (L)",
        description_en:
          "Comfortable adult pants for those with mobility issues or incontinence. International quality standards.",
        description_sw:
          "Pants za watu wazima zenye faraja kwa wenye matatizo ya kutembea au kukojoa bila kujizuia. Viwango vya kimataifa.",
        price: 25000.0,
        wholesale_price: 22000.0,
        category: "adultDiapers",
        size: "large",
        bundle_size: 20,
        carton_size: "4 bundles (80 pieces)",
        hip_size: "80-105cm",
        stock: 30,
        featured: true,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1022.jpg-ACW4aUFuZSJnBBpx7KHHpriGFYTAgE.jpeg",
        tags: ["internationalQuality", "adult"],
      },
      {
        name_en: "Adult Pants - Extra Large (XL)",
        name_sw: "Pants za Watu Wazima - Kubwa Zaidi (XL)",
        description_en: "Extra large adult pants for maximum comfort and protection. Perfect for larger individuals.",
        description_sw: "Pants kubwa zaidi za watu wazima kwa faraja na ulinzi wa hali ya juu. Nzuri kwa watu wakubwa.",
        price: 28000.0,
        wholesale_price: 25000.0,
        category: "adultDiapers",
        size: "extraLarge",
        bundle_size: 20,
        carton_size: "4 bundles (80 pieces)",
        hip_size: "105-130cm",
        stock: 25,
        featured: false,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1020.jpg-d0BiyLZoj7T35mr3ZDsASJHCNLsn9j.jpeg",
        tags: ["internationalQuality", "adult"],
      },
      {
        name_en: "Adult Pants - XXL",
        name_sw: "Pants za Watu Wazima - XXL",
        description_en: "XXL adult pants for maximum comfort and protection. Our largest size for ultimate coverage.",
        description_sw:
          "Pants za XXL za watu wazima kwa faraja na ulinzi wa hali ya juu. Ukubwa wetu mkubwa zaidi kwa ufunikaji kamili.",
        price: 30000.0,
        wholesale_price: 27000.0,
        category: "adultDiapers",
        size: "extraLarge",
        bundle_size: 20,
        carton_size: "4 bundles (80 pieces)",
        hip_size: ">130cm",
        stock: 20,
        featured: false,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1020.jpg-d0BiyLZoj7T35mr3ZDsASJHCNLsn9j.jpeg",
        tags: ["internationalQuality", "adult", "xxl"],
      },
      // Baby Wipes
      {
        name_en: "Baby Wipes - 120 Sheets",
        name_sw: "Wipes za Watoto - Karatasi 120",
        description_en: "Soft and gentle baby wipes for cleaning your baby's delicate skin. Pack of 120 sheets.",
        description_sw: "Wipes laini na nyororo kwa kusafisha ngozi nyeti ya mtoto wako. Pakiti ya karatasi 120.",
        price: 4000.0,
        wholesale_price: 3500.0,
        category: "babyDiapers",
        bundle_size: 120,
        carton_size: "24 packs",
        stock: 200,
        featured: true,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1025.jpg-AhNojXnbDx5fyKY8p4xiXzW0sMdXk0.jpeg",
        tags: ["newArrival", "wipes"],
      },
      // Special Baby Diaper XXXL
      {
        name_en: "Baby Diaper XXXL (19kg+)",
        name_sw: "Diaper za Watoto XXXL (19kg+)",
        description_en:
          "Our largest size baby diapers for older toddlers. Maximum comfort and absorption for active children.",
        description_sw:
          "Diaper zetu za ukubwa mkubwa zaidi kwa watoto wakubwa. Faraja na unyonywaji wa hali ya juu kwa watoto wanaocheza.",
        price: 24000.0,
        wholesale_price: 21000.0,
        category: "babyPants",
        size: "extraLarge",
        bundle_size: 50,
        carton_size: "4 bundles (200 pieces)",
        weight_range: "19kg+",
        stock: 30,
        featured: false,
        image_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1015.jpg-MrDwEHu3Gt9fjrXcq7CwoswxVdePaz.jpeg",
        tags: ["newArrival", "xxxl"],
      },
    ]

    let insertedCount = 0
    for (const product of products) {
      await sql`
        INSERT INTO products (
          name_en, name_sw, description_en, description_sw,
          price, wholesale_price, category, size, bundle_size, carton_size,
          weight_range, hip_size, stock, featured, status, image_url, tags
        ) VALUES (
          ${product.name_en},
          ${product.name_sw},
          ${product.description_en},
          ${product.description_sw},
          ${product.price},
          ${product.wholesale_price || null},
          ${product.category},
          ${product.size || null},
          ${product.bundle_size},
          ${product.carton_size},
          ${product.weight_range || null},
          ${product.hip_size || null},
          ${product.stock},
          ${product.featured},
          'active',
          ${product.image_url},
          ${product.tags}
        )
      `
      insertedCount++
      console.log(`✅ Inserted: ${product.name_en}`)
    }

    // Get verification data
    const stats = await sql`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN featured = true THEN 1 END) as featured_products,
        COUNT(DISTINCT category) as categories
      FROM products
    `

    const allProducts = await sql`
      SELECT 
        id, name_en, category, price, wholesale_price, stock, featured, status
      FROM products 
      ORDER BY category, name_en
    `

    console.log(`🎉 Live database setup complete! ${insertedCount} products imported`)

    return NextResponse.json({
      success: true,
      message: `Live database setup complete! ${insertedCount} products imported`,
      stats: {
        total: Number(stats[0].total_products),
        featured: Number(stats[0].featured_products),
        categories: Number(stats[0].categories),
      },
      products: allProducts.map((p) => ({
        id: p.id,
        name: p.name_en,
        category: p.category,
        price: Number(p.price),
        wholesale_price: p.wholesale_price ? Number(p.wholesale_price) : null,
        stock: p.stock,
        featured: p.featured,
        status: p.status,
      })),
    })
  } catch (error) {
    console.error("❌ Live database setup failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to setup live database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

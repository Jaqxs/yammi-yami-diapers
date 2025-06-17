import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("🚀 Setting up complete database schema...")

    // Test connection first
    await sql`SELECT 1 as test;`
    console.log("✅ Database connection verified")

    // Drop existing tables for clean setup
    console.log("🗑️ Dropping existing tables...")
    await sql`DROP TABLE IF EXISTS order_items CASCADE;`
    await sql`DROP TABLE IF EXISTS orders CASCADE;`
    await sql`DROP TABLE IF EXISTS product_reviews CASCADE;`
    await sql`DROP TABLE IF EXISTS inventory_logs CASCADE;`
    await sql`DROP TABLE IF EXISTS products CASCADE;`
    await sql`DROP TABLE IF EXISTS categories CASCADE;`

    // Create categories table
    console.log("📋 Creating categories table...")
    await sql`
      CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          name_en VARCHAR(100) NOT NULL,
          name_sw VARCHAR(100) NOT NULL,
          description_en TEXT,
          description_sw TEXT,
          slug VARCHAR(100) UNIQUE NOT NULL,
          image_url TEXT,
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create products table
    console.log("📦 Creating products table...")
    await sql`
      CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name_en VARCHAR(255) NOT NULL,
          name_sw VARCHAR(255) NOT NULL,
          description_en TEXT,
          description_sw TEXT,
          short_description_en TEXT,
          short_description_sw TEXT,
          price DECIMAL(10, 2) NOT NULL,
          wholesale_price DECIMAL(10, 2),
          category VARCHAR(50) NOT NULL,
          category_id INTEGER REFERENCES categories(id),
          size VARCHAR(50),
          bundle_size INTEGER,
          carton_size VARCHAR(100),
          weight_range VARCHAR(50),
          hip_size VARCHAR(50),
          age_range VARCHAR(50),
          stock INTEGER DEFAULT 100,
          min_stock_level INTEGER DEFAULT 10,
          featured BOOLEAN DEFAULT false,
          status VARCHAR(20) DEFAULT 'active',
          image_url TEXT,
          gallery_images TEXT[],
          tags TEXT[],
          sku VARCHAR(100) UNIQUE,
          barcode VARCHAR(100),
          dimensions VARCHAR(100),
          weight DECIMAL(8, 2),
          material TEXT,
          care_instructions TEXT,
          manufacturer VARCHAR(100) DEFAULT 'Yammy Yami',
          country_of_origin VARCHAR(50) DEFAULT 'Tanzania',
          warranty_period VARCHAR(50),
          certifications TEXT[],
          seo_title VARCHAR(255),
          seo_description TEXT,
          seo_keywords TEXT[],
          sort_order INTEGER DEFAULT 0,
          view_count INTEGER DEFAULT 0,
          purchase_count INTEGER DEFAULT 0,
          rating DECIMAL(3, 2) DEFAULT 0.00,
          review_count INTEGER DEFAULT 0,
          is_new BOOLEAN DEFAULT true,
          is_bestseller BOOLEAN DEFAULT false,
          is_on_sale BOOLEAN DEFAULT false,
          sale_price DECIMAL(10, 2),
          sale_start_date TIMESTAMP,
          sale_end_date TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create orders table
    console.log("🛒 Creating orders table...")
    await sql`
      CREATE TABLE orders (
          id SERIAL PRIMARY KEY,
          order_number VARCHAR(50) UNIQUE NOT NULL DEFAULT ('YY' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('orders_id_seq')::TEXT, 4, '0')),
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255),
          customer_phone VARCHAR(50),
          customer_address TEXT,
          customer_city VARCHAR(100),
          customer_region VARCHAR(100),
          customer_postal_code VARCHAR(20),
          billing_address TEXT,
          shipping_address TEXT,
          subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
          tax_amount DECIMAL(10, 2) DEFAULT 0.00,
          shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
          discount_amount DECIMAL(10, 2) DEFAULT 0.00,
          total_amount DECIMAL(10, 2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'TZS',
          status VARCHAR(50) DEFAULT 'pending',
          payment_status VARCHAR(50) DEFAULT 'pending',
          payment_method VARCHAR(50),
          payment_reference VARCHAR(100),
          shipping_method VARCHAR(50),
          tracking_number VARCHAR(100),
          notes TEXT,
          internal_notes TEXT,
          order_source VARCHAR(50) DEFAULT 'website',
          processed_at TIMESTAMP,
          shipped_at TIMESTAMP,
          delivered_at TIMESTAMP,
          cancelled_at TIMESTAMP,
          refunded_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create order_items table
    console.log("📋 Creating order_items table...")
    await sql`
      CREATE TABLE order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          product_id INTEGER REFERENCES products(id),
          product_name VARCHAR(255) NOT NULL,
          product_sku VARCHAR(100),
          quantity INTEGER NOT NULL,
          unit_price DECIMAL(10, 2) NOT NULL,
          total_price DECIMAL(10, 2) NOT NULL,
          discount_amount DECIMAL(10, 2) DEFAULT 0.00,
          tax_amount DECIMAL(10, 2) DEFAULT 0.00,
          product_options JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create product_reviews table
    console.log("⭐ Creating product_reviews table...")
    await sql`
      CREATE TABLE product_reviews (
          id SERIAL PRIMARY KEY,
          product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255),
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          title VARCHAR(255),
          review_text TEXT,
          is_verified_purchase BOOLEAN DEFAULT false,
          is_approved BOOLEAN DEFAULT false,
          helpful_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Create inventory_logs table
    console.log("📊 Creating inventory_logs table...")
    await sql`
      CREATE TABLE inventory_logs (
          id SERIAL PRIMARY KEY,
          product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
          change_type VARCHAR(50) NOT NULL,
          quantity_change INTEGER NOT NULL,
          previous_stock INTEGER NOT NULL,
          new_stock INTEGER NOT NULL,
          reason TEXT,
          reference_id INTEGER,
          reference_type VARCHAR(50),
          created_by VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Insert default categories
    console.log("📂 Inserting default categories...")
    await sql`
      INSERT INTO categories (name_en, name_sw, description_en, description_sw, slug) VALUES
      ('Baby Diapers', 'Nepi za Watoto', 'Soft and comfortable diapers for babies and toddlers', 'Nepi laini na za ustarehe kwa watoto na watoto wadogo', 'baby-diapers'),
      ('Baby Pants', 'Pants za Watoto', 'Easy-to-wear pull-up style diapers for active babies', 'Nepi za kuvarishwa kama suruali kwa watoto wenye kucheza', 'baby-pants'),
      ('Adult Diapers', 'Nepi za Watu Wazima', 'Comfortable and discreet protection for adults', 'Ulinzi wa ustarehe na wa siri kwa watu wazima', 'adult-diapers'),
      ('Lady Pads', 'Pedi za Wanawake', 'Premium sanitary pads for women', 'Pedi za ubora wa juu kwa wanawake', 'lady-pads');
    `

    // Create indexes
    console.log("🔍 Creating indexes...")
    await sql`CREATE INDEX idx_products_category ON products(category);`
    await sql`CREATE INDEX idx_products_status ON products(status);`
    await sql`CREATE INDEX idx_products_featured ON products(featured);`
    await sql`CREATE INDEX idx_products_price ON products(price);`
    await sql`CREATE INDEX idx_products_stock ON products(stock);`
    await sql`CREATE INDEX idx_products_created_at ON products(created_at);`
    await sql`CREATE INDEX idx_orders_status ON orders(status);`
    await sql`CREATE INDEX idx_orders_created_at ON orders(created_at);`
    await sql`CREATE INDEX idx_order_items_order_id ON order_items(order_id);`
    await sql`CREATE INDEX idx_order_items_product_id ON order_items(product_id);`

    // Create update trigger function
    console.log("⚡ Creating update triggers...")
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `

    await sql`CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`
    await sql`CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`
    await sql`CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`

    // Verify setup
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `

    const categories = await sql`SELECT COUNT(*) as count FROM categories;`

    console.log("✅ Database setup completed successfully!")
    console.log(`📋 Created ${tables.length} tables`)
    console.log(`📂 Inserted ${categories[0].count} categories`)

    return NextResponse.json({
      success: true,
      message: `Database setup completed successfully! Created ${tables.length} tables and ${categories[0].count} categories.`,
      tables: tables.map((t) => t.table_name),
      categoriesCount: Number(categories[0].count),
    })
  } catch (error) {
    console.error("❌ Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to setup database",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

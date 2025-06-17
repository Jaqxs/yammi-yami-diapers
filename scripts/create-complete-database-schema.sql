-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
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

-- Create products table with all necessary fields
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

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
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
    ip_address INET,
    user_agent TEXT,
    processed_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
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

-- Create product_reviews table
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

-- Create inventory_logs table
CREATE TABLE inventory_logs (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL, -- 'stock_in', 'stock_out', 'adjustment', 'sale'
    quantity_change INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reason TEXT,
    reference_id INTEGER, -- Could reference order_id or other tables
    reference_type VARCHAR(50), -- 'order', 'adjustment', 'return', etc.
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name_en, name_sw, description_en, description_sw, slug) VALUES
('Baby Diapers', 'Nepi za Watoto', 'Soft and comfortable diapers for babies and toddlers', 'Nepi laini na za ustarehe kwa watoto na watoto wadogo', 'baby-diapers'),
('Baby Pants', 'Pants za Watoto', 'Easy-to-wear pull-up style diapers for active babies', 'Nepi za kuvarishwa kama suruali kwa watoto wenye kucheza', 'baby-pants'),
('Adult Diapers', 'Nepi za Watu Wazima', 'Comfortable and discreet protection for adults', 'Ulinzi wa ustarehe na wa siri kwa watu wazima', 'adult-diapers'),
('Lady Pads', 'Pedi za Wanawake', 'Premium sanitary pads for women', 'Pedi za ubora wa juu kwa wanawake', 'lady-pads');

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_order_number ON orders(order_number);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX idx_product_reviews_approved ON product_reviews(is_approved);

CREATE INDEX idx_inventory_logs_product_id ON inventory_logs(product_id);
CREATE INDEX idx_inventory_logs_created_at ON inventory_logs(created_at);
CREATE INDEX idx_inventory_logs_change_type ON inventory_logs(change_type);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'YY' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('orders_id_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Set default order number for orders
ALTER TABLE orders ALTER COLUMN order_number SET DEFAULT generate_order_number();

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;

-- Insert some sample data to verify setup
INSERT INTO products (
    name_en, name_sw, description_en, description_sw, 
    price, wholesale_price, category, size, stock, 
    featured, status, image_url, sku
) VALUES
('Sample Baby Diaper', 'Nepi ya Mfano', 
 'Sample product for testing', 'Bidhaa ya mfano kwa majaribio', 
 15000, 12000, 'babyDiapers', 'Medium', 100, 
 true, 'active', '/images/baby-diapers.png', 'YY-BD-001');

-- Verify the setup
SELECT 'Database setup completed successfully!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

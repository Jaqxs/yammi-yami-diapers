-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS agent_sales CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_sw VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_sw TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_sw VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_sw TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  wholesale_price DECIMAL(10,2),
  agent_price DECIMAL(10,2),
  size VARCHAR(100),
  bundle_size INTEGER,
  carton_size VARCHAR(100),
  weight_range VARCHAR(100),
  hip_size VARCHAR(100),
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'low_stock', 'out_of_stock', 'draft', 'discontinued')),
  featured BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  gallery_images TEXT[],
  tags TEXT[],
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  dimensions VARCHAR(100),
  material VARCHAR(255),
  age_range VARCHAR(100),
  gender VARCHAR(20) CHECK (gender IN ('unisex', 'boy', 'girl', 'adult')),
  absorption_level VARCHAR(50),
  pack_type VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_address TEXT,
  customer_city VARCHAR(100),
  customer_region VARCHAR(100),
  customer_country VARCHAR(100) DEFAULT 'Tanzania',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partial')),
  payment_method VARCHAR(50),
  shipping_method VARCHAR(50),
  tracking_number VARCHAR(100),
  notes TEXT,
  admin_notes TEXT,
  order_source VARCHAR(50) DEFAULT 'website',
  agent_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(100),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agents table
CREATE TABLE agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  whatsapp_number VARCHAR(50),
  location VARCHAR(255),
  region VARCHAR(100),
  city VARCHAR(100),
  address TEXT,
  id_number VARCHAR(50),
  bank_name VARCHAR(100),
  bank_account VARCHAR(100),
  mobile_money VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending', 'suspended', 'terminated')),
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_commission DECIMAL(10,2) DEFAULT 0,
  registration_date DATE DEFAULT CURRENT_DATE,
  approval_date DATE,
  last_order_date DATE,
  profile_image TEXT,
  documents TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_sales table for tracking sales performance
CREATE TABLE agent_sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sale_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registrations table for agent applications
CREATE TABLE registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  whatsapp_number VARCHAR(50),
  location VARCHAR(255) NOT NULL,
  region VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  address TEXT,
  id_number VARCHAR(50),
  age INTEGER,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
  education_level VARCHAR(100),
  business_experience TEXT,
  why_join TEXT,
  referral_source VARCHAR(100),
  has_transport BOOLEAN DEFAULT FALSE,
  transport_type VARCHAR(100),
  investment_capacity DECIMAL(10,2),
  target_market TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'contacted')),
  admin_notes TEXT,
  application_date DATE DEFAULT CURRENT_DATE,
  review_date DATE,
  reviewer_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_sw VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt_en TEXT,
  excerpt_sw TEXT,
  content_en TEXT NOT NULL,
  content_sw TEXT NOT NULL,
  featured_image TEXT,
  gallery_images TEXT[],
  author_name VARCHAR(255) NOT NULL,
  author_image TEXT,
  category VARCHAR(100),
  tags TEXT[],
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_products_sku ON products(sku);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_order_number ON orders(order_number);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_region ON agents(region);
CREATE INDEX idx_agents_agent_code ON agents(agent_code);

CREATE INDEX idx_agent_sales_agent_id ON agent_sales(agent_id);
CREATE INDEX idx_agent_sales_order_id ON agent_sales(order_id);
CREATE INDEX idx_agent_sales_status ON agent_sales(status);

CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_region ON registrations(region);
CREATE INDEX idx_registrations_application_date ON registrations(application_date);

CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'YY' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_sequence')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_sequence START 1;

-- Create trigger for order number generation
CREATE TRIGGER generate_order_number_trigger 
    BEFORE INSERT ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_order_number();

-- Create function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Update stock when order item is inserted
    IF TG_OP = 'INSERT' THEN
        UPDATE products 
        SET stock = stock - NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.product_id;
        
        -- Update product status based on stock level
        UPDATE products 
        SET status = CASE 
            WHEN stock <= 0 THEN 'out_of_stock'
            WHEN stock <= min_stock_level THEN 'low_stock'
            ELSE 'active'
        END
        WHERE id = NEW.product_id;
        
        RETURN NEW;
    END IF;
    
    -- Restore stock when order item is deleted
    IF TG_OP = 'DELETE' THEN
        UPDATE products 
        SET stock = stock + OLD.quantity,
            updated_at = NOW()
        WHERE id = OLD.product_id;
        
        -- Update product status based on stock level
        UPDATE products 
        SET status = CASE 
            WHEN stock <= 0 THEN 'out_of_stock'
            WHEN stock <= min_stock_level THEN 'low_stock'
            ELSE 'active'
        END
        WHERE id = OLD.product_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for stock updates
CREATE TRIGGER update_product_stock_trigger
    AFTER INSERT OR DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();

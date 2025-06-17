-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_sw VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_sw TEXT,
  price DECIMAL(10, 2) NOT NULL,
  wholesale_price DECIMAL(10, 2),
  category VARCHAR(100) NOT NULL,
  size VARCHAR(50),
  bundle_size INTEGER,
  carton_size VARCHAR(50),
  weight_range VARCHAR(50),
  hip_size VARCHAR(50),
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active',
  image_url TEXT,
  tags TEXT[], -- PostgreSQL array for tags
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_sw VARCHAR(100) NOT NULL,
  description_en TEXT,
  description_sw TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name_en, name_sw, description_en, description_sw) VALUES
('Baby Diapers', 'Nepi za Watoto', 'Comfortable diapers for babies', 'Nepi za starehe kwa watoto'),
('Adult Diapers', 'Nepi za Watu Wazima', 'Adult incontinence products', 'Bidhaa za watu wazima'),
('Lady Pads', 'Pedi za Wanawake', 'Feminine hygiene products', 'Bidhaa za usafi wa kike'),
('Pull-up Pants', 'Suruali za Kuvaa', 'Training pants for toddlers', 'Suruali za mafunzo kwa watoto')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

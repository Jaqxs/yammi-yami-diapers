-- Drop existing tables to start fresh (be careful in production!)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_sw VARCHAR(100) NOT NULL,
    description_en TEXT,
    description_sw TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table with all necessary columns
CREATE TABLE products (
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
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name_en, name_sw, description_en, description_sw) VALUES
('Baby Diapers', 'Nepi za Watoto', 'Soft and comfortable diapers for babies', 'Nepi laini na za ustarehe kwa watoto'),
('Adult Diapers', 'Nepi za Watu Wazima', 'Comfortable protection for adults', 'Ulinzi wa ustarehe kwa watu wazima'),
('Lady Pads', 'Pedi za Wanawake', 'Sanitary pads for women', 'Pedi za usafi kwa wanawake'),
('Pull-up Pants', 'Suruali za Kuvaa', 'Easy-to-wear pull-up style diapers', 'Nepi za kuvarishwa kama suruali');

-- Insert sample products
INSERT INTO products (
    name_en, name_sw, description_en, description_sw, 
    price, wholesale_price, category, size, stock, 
    featured, status, image_url
) VALUES
('Yammy Yami Baby Diapers Small', 'Nepi za Yammy Yami Ndogo', 
 'Premium quality baby diapers for newborns', 'Nepi za ubora wa juu kwa wajane', 
 12.99, 10.50, 'Baby Diapers', 'Small', 100, true, 'active', '/images/baby-diapers.png'),
 
('Yammy Yami Adult Diapers Large', 'Nepi za Yammy Yami Kubwa', 
 'Comfortable adult diapers with maximum absorption', 'Nepi za watu wazima zenye kuyongeza mengi', 
 18.99, 15.50, 'Adult Diapers', 'Large', 50, true, 'active', '/images/adult-diapers.png'),
 
('Yammy Yami Lady Pads Regular', 'Pedi za Yammy Yami za Kawaida', 
 'Ultra-soft sanitary pads for everyday comfort', 'Pedi laini sana za ustarehe wa kila siku', 
 8.99, 7.50, 'Lady Pads', 'Regular', 150, true, 'active', '/images/lady-pads.png');

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

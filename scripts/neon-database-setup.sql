-- Yammy Yami Diapers Database Setup for Neon
-- Run this script in your Neon database console

-- Drop existing tables if they exist (optional - only if you want to start fresh)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_sw VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description_en TEXT,
    description_sw TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_sw VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_sw TEXT,
    price DECIMAL(10, 2) NOT NULL,
    wholesale_price DECIMAL(10, 2),
    category VARCHAR(50) NOT NULL,
    size VARCHAR(50),
    bundle_size INTEGER,
    carton_size VARCHAR(100),
    weight_range VARCHAR(50),
    hip_size VARCHAR(50),
    stock INTEGER DEFAULT 100,
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_name_en ON products(name_en);

-- Insert categories
INSERT INTO categories (name_en, name_sw, slug, description_en, description_sw) VALUES
('Baby Diapers', 'Nepi za Watoto', 'baby-diapers', 'High-quality diapers for babies', 'Nepi za ubora wa juu kwa watoto'),
('Baby Pants', 'Pants za Watoto', 'baby-pants', 'Pull-up pants for active babies', 'Pants za kuvaa kwa watoto wanaocheza'),
('Adult Diapers', 'Nepi za Watu Wazima', 'adult-diapers', 'Comfortable diapers for adults', 'Nepi za faraja kwa watu wazima');

-- Insert all products
INSERT INTO products (
    name_en, name_sw, description_en, description_sw,
    price, wholesale_price, category, size, bundle_size, carton_size,
    weight_range, hip_size, stock, featured, status, image_url, tags
) VALUES 
-- Baby Diapers - Side Tape
(
    'Baby Diapers Side Tape - Small (S)',
    'Diapers za Watoto Side Tape - Ndogo (S)',
    'Premium baby diapers with side tape closure for secure fit. Perfect for newborns and small babies.',
    'Diapers bora za watoto zenye utepe wa pembeni kwa usalama zaidi. Nzuri kwa watoto wachanga na wadogo.',
    18000.00, 16000.00, 'babyDiapers', 'small', 50, '4 bundles (200 pieces)',
    '4-8kg', NULL, 120, true, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg',
    ARRAY['bestSeller', 'sideTape']
),
(
    'Baby Diapers Side Tape - Medium (M)',
    'Diapers za Watoto Side Tape - Wastani (M)',
    'Medium size baby diapers with side tape for growing babies. Excellent absorption and comfort.',
    'Diapers za ukubwa wa wastani zenye utepe wa pembeni kwa watoto wanaokua. Unyonywaji na faraja bora.',
    18000.00, 16000.00, 'babyDiapers', 'medium', 48, '4 bundles (192 pieces)',
    '6-11kg', NULL, 95, true, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg',
    ARRAY['bestSeller', 'sideTape']
),
(
    'Baby Diapers Side Tape - Large (L)',
    'Diapers za Watoto Side Tape - Kubwa (L)',
    'Large size baby diapers with side tape for active toddlers. Superior protection and comfort.',
    'Diapers za ukubwa mkubwa zenye utepe wa pembeni kwa watoto wanaocheza. Ulinzi na faraja ya hali ya juu.',
    18000.00, 16000.00, 'babyDiapers', 'large', 44, '4 bundles (176 pieces)',
    '9-14kg', NULL, 80, false, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg',
    ARRAY['bestSeller', 'sideTape']
),
(
    'Baby Diapers Side Tape - Extra Large (XL)',
    'Diapers za Watoto Side Tape - Kubwa Zaidi (XL)',
    'Extra large baby diapers with side tape for bigger toddlers. Maximum absorption and security.',
    'Diapers za ukubwa mkubwa zaidi zenye utepe wa pembeni kwa watoto wakubwa. Unyonywaji na usalama wa hali ya juu.',
    18000.00, 16000.00, 'babyDiapers', 'extraLarge', 40, '4 bundles (160 pieces)',
    '12-17kg', NULL, 65, false, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg',
    ARRAY['sideTape']
),

-- Baby Pull-up Pants
(
    'Baby Pull-up Pants - Medium (M)',
    'Pants za Watoto - Wastani (M)',
    'Easy-to-wear pull-up pants for active babies. Japan standard quality with superior absorption.',
    'Pants rahisi kuvaa kwa watoto wanaocheza. Ubora wa kiwango cha Japani na unyonywaji bora.',
    20000.00, 17000.00, 'babyPants', 'medium', 50, '4 bundles (200 pieces)',
    '6-11kg', NULL, 85, true, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1012.jpg-ES0dluaBooNTot5s1D4osLe125JMM4.jpeg',
    ARRAY['japanStandard', 'pullUp']
),
(
    'Baby Pull-up Pants - Large (L)',
    'Pants za Watoto - Kubwa (L)',
    'Large pull-up pants for growing toddlers. Easy to put on and take off with excellent fit.',
    'Pants za ukubwa mkubwa kwa watoto wanaokua. Rahisi kuvaa na kuvua na urafiki mzuri.',
    20000.00, 17000.00, 'babyPants', 'large', 50, '4 bundles (200 pieces)',
    '9-14kg', NULL, 70, false, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1016.jpg-N7AFkyLYxdcxtB9xZpOyAB7xo2TYYZ.jpeg',
    ARRAY['bestSeller', 'pullUp']
),
(
    'Baby Pull-up Pants - Extra Large (XL)',
    'Pants za Watoto - Kubwa Zaidi (XL)',
    'Extra large pull-up pants for bigger toddlers. Premium quality with maximum comfort and protection.',
    'Pants za ukubwa mkubwa zaidi kwa watoto wakubwa. Ubora wa hali ya juu na faraja na ulinzi wa hali ya juu.',
    20000.00, 17000.00, 'babyPants', 'extraLarge', 50, '4 bundles (200 pieces)',
    '12-17kg', NULL, 55, false, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1009.jpg-BIK0Z64A1WCzCs1Id2cgiGSKGHHL2Z.jpeg',
    ARRAY['japanStandard', 'pullUp']
),

-- Premium Royal Baby Pants
(
    'Premium Royal Baby Pants - Large (L)',
    'Pants Bora za Kifalme za Watoto - Kubwa (L)',
    'Our highest quality royal pants with premium absorption and extra softness. Royal quality for your baby.',
    'Pants zetu za ubora wa juu zaidi za kifalme zenye unyonywaji wa hali ya juu na ulaini wa ziada. Ubora wa kifalme kwa mtoto wako.',
    22000.00, 19000.00, 'babyPants', 'large', 50, '4 bundles (200 pieces)',
    '9-14kg', NULL, 40, true, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1011.jpg-kyHylrVCgJKZGHSxfOAMQ6GEz7jRUZ.jpeg',
    ARRAY['bestSeller', 'premium', 'royal']
),

-- Adult Diapers/Pants
(
    'Adult Pants - Large (L)',
    'Pants za Watu Wazima - Kubwa (L)',
    'Comfortable adult pants for those with mobility issues or incontinence. International quality standards.',
    'Pants za watu wazima zenye faraja kwa wenye matatizo ya kutembea au kukojoa bila kujizuia. Viwango vya kimataifa.',
    25000.00, 22000.00, 'adultDiapers', 'large', 20, '4 bundles (80 pieces)',
    NULL, '80-105cm', 30, true, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1022.jpg-ACW4aUFuZSJnBBpx7KHHpriGFYTAgE.jpeg',
    ARRAY['internationalQuality', 'adult']
),
(
    'Adult Pants - Extra Large (XL)',
    'Pants za Watu Wazima - Kubwa Zaidi (XL)',
    'Extra large adult pants for maximum comfort and protection. Perfect for larger individuals.',
    'Pants kubwa zaidi za watu wazima kwa faraja na ulinzi wa hali ya juu. Nzuri kwa watu wakubwa.',
    28000.00, 25000.00, 'adultDiapers', 'extraLarge', 20, '4 bundles (80 pieces)',
    NULL, '105-130cm', 25, false, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1020.jpg-d0BiyLZoj7T35mr3ZDsASJHCNLsn9j.jpeg',
    ARRAY['internationalQuality', 'adult']
),
(
    'Adult Pants - XXL',
    'Pants za Watu Wazima - XXL',
    'XXL adult pants for maximum comfort and protection. Our largest size for ultimate coverage.',
    'Pants za XXL za watu wazima kwa faraja na ulinzi wa hali ya juu. Ukubwa wetu mkubwa zaidi kwa ufunikaji kamili.',
    30000.00, 27000.00, 'adultDiapers', 'extraLarge', 20, '4 bundles (80 pieces)',
    NULL, '>130cm', 20, false, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1020.jpg-d0BiyLZoj7T35mr3ZDsASJHCNLsn9j.jpeg',
    ARRAY['internationalQuality', 'adult', 'xxl']
),

-- Baby Wipes
(
    'Baby Wipes - 120 Sheets',
    'Wipes za Watoto - Karatasi 120',
    'Soft and gentle baby wipes for cleaning your baby''s delicate skin. Pack of 120 sheets.',
    'Wipes laini na nyororo kwa kusafisha ngozi nyeti ya mtoto wako. Pakiti ya karatasi 120.',
    4000.00, 3500.00, 'babyDiapers', NULL, 120, '24 packs',
    NULL, NULL, 200, true, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1025.jpg-AhNojXnbDx5fyKY8p4xiXzW0sMdXk0.jpeg',
    ARRAY['newArrival', 'wipes']
),

-- Special Baby Diaper XXXL
(
    'Baby Diaper XXXL (19kg+)',
    'Diaper za Watoto XXXL (19kg+)',
    'Our largest size baby diapers for older toddlers. Maximum comfort and absorption for active children.',
    'Diaper zetu za ukubwa mkubwa zaidi kwa watoto wakubwa. Faraja na unyonywaji wa hali ya juu kwa watoto wanaocheza.',
    24000.00, 21000.00, 'babyPants', 'extraLarge', 50, '4 bundles (200 pieces)',
    '19kg+', NULL, 30, false, 'active',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1015.jpg-MrDwEHu3Gt9fjrXcq7CwoswxVdePaz.jpeg',
    ARRAY['newArrival', 'xxxl']
);

-- Create orders table for future use
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_address TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table for future use
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for orders
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Verify the setup
SELECT 
    'Products' as table_name,
    COUNT(*) as count,
    COUNT(CASE WHEN featured = true THEN 1 END) as featured_count
FROM products
UNION ALL
SELECT 
    'Categories' as table_name,
    COUNT(*) as count,
    0 as featured_count
FROM categories;

-- Show sample products
SELECT 
    id, 
    name_en, 
    category, 
    price, 
    wholesale_price,
    stock,
    featured,
    status
FROM products 
ORDER BY category, name_en;

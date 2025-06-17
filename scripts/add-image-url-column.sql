-- Add image_url column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing products table structure if needed
DO $$ 
BEGIN
    -- Check if the column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE products ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Also ensure all other columns exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS name_sw VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_sw TEXT,
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS wholesale_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS size VARCHAR(50),
ADD COLUMN IF NOT EXISTS bundle_size INTEGER,
ADD COLUMN IF NOT EXISTS carton_size VARCHAR(50),
ADD COLUMN IF NOT EXISTS weight_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS hip_size VARCHAR(50),
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

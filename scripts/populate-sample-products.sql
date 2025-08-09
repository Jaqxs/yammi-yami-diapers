-- Insert sample products into the database
-- Make sure to run the main schema script first

-- Get category IDs
DO $$
DECLARE
    baby_diapers_id UUID;
    baby_pants_id UUID;
    adult_diapers_id UUID;
    lady_pads_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO baby_diapers_id FROM categories WHERE name_en = 'Baby Diapers';
    SELECT id INTO baby_pants_id FROM categories WHERE name_en = 'Baby Pants';
    SELECT id INTO adult_diapers_id FROM categories WHERE name_en = 'Adult Diapers';
    SELECT id INTO lady_pads_id FROM categories WHERE name_en = 'Lady Pads';

    -- Insert sample products
    INSERT INTO products (
        name_en, name_sw, description_en, description_sw, category_id, 
        price, wholesale_price, size, bundle_size, carton_size, 
        weight_range, hip_size, stock, status, featured, image_url, tags
    ) VALUES
    -- Baby Diapers
    (
        'Yammy Yami Baby Diapers Small',
        'Nepi za Yammy Yami Ndogo',
        'Ultra-soft and absorbent baby diapers for newborns and small babies. Features advanced leak protection and comfortable fit.',
        'Nepi laini na zinazonyonya vizuri kwa watoto wachanga na wadogo. Zina ulinzi wa hali ya juu dhidi ya kuvuja na ni za starehe.',
        baby_diapers_id,
        15000, 12000, 'Small', 30, '12 packs', '3-6 kg', '40-60 cm', 150, 'active', true,
        '/images/baby-diapers.png',
        ARRAY['premium', 'soft', 'absorbent', 'leak-proof']
    ),
    (
        'Yammy Yami Baby Diapers Medium',
        'Nepi za Yammy Yami za Wastani',
        'Perfect fit for growing babies with superior absorption and comfort. Hypoallergenic and gentle on sensitive skin.',
        'Zinafaa vizuri kwa watoto wanaokua na zina uwezo mkubwa wa kunyonya na starehe. Hazisababishi mzio na ni laini kwa ngozi nyeti.',
        baby_diapers_id,
        16000, 13000, 'Medium', 28, '12 packs', '6-9 kg', '50-70 cm', 120, 'active', true,
        '/images/baby-diapers.png',
        ARRAY['premium', 'hypoallergenic', 'comfortable']
    ),
    (
        'Yammy Yami Baby Diapers Large',
        'Nepi za Yammy Yami Kubwa',
        'Extra absorption for active toddlers. Flexible waistband and leg cuffs for maximum comfort and protection.',
        'Unyonyaji wa ziada kwa watoto wazoefu. Ukanda wa kiuno unaonyesha na mikanda ya miguu kwa starehe na ulinzi wa juu.',
        baby_diapers_id,
        17000, 14000, 'Large', 26, '12 packs', '9-14 kg', '60-80 cm', 100, 'active', false,
        '/images/baby-diapers.png',
        ARRAY['extra-absorption', 'flexible', 'active-babies']
    ),
    
    -- Baby Pants
    (
        'Yammy Yami Baby Pants Small',
        'Pants za Yammy Yami Ndogo',
        'Easy-to-wear baby pants with 360-degree stretch for active babies. Pull-up design for quick changes.',
        'Pants za watoto rahisi kuvaa na kunyoosha kila upande kwa watoto wazoefu. Muundo wa kuvuta juu kwa mabadiliko ya haraka.',
        baby_pants_id,
        18000, 15000, 'Small', 24, '10 packs', '6-9 kg', '50-70 cm', 80, 'active', true,
        '/images/baby-diapers.png',
        ARRAY['pull-up', 'stretch', 'easy-wear', 'active']
    ),
    (
        'Yammy Yami Baby Pants Medium',
        'Pants za Yammy Yami za Wastani',
        'Comfortable baby pants with superior fit and absorption. Perfect for potty training and active play.',
        'Pants za watoto zenye starehe na unyonyaji bora. Zinafaa kwa mafunzo ya choo na mchezo wa kizoefu.',
        baby_pants_id,
        19000, 16000, 'Medium', 22, '10 packs', '9-14 kg', '60-80 cm', 70, 'active', false,
        '/images/baby-diapers.png',
        ARRAY['potty-training', 'comfortable', 'active-play']
    ),
    
    -- Adult Diapers
    (
        'Yammy Yami Adult Diapers Medium',
        'Nepi za Watu Wazima za Wastani',
        'Discreet and comfortable adult diapers with maximum absorption. Designed for dignity and confidence.',
        'Nepi za watu wazima za siri na zenye starehe na unyonyaji wa juu. Zimeundwa kwa heshima na ujasiri.',
        adult_diapers_id,
        25000, 20000, 'Medium', 20, '8 packs', 'Adult', '70-100 cm', 60, 'active', false,
        '/images/baby-diapers.png',
        ARRAY['discreet', 'maximum-absorption', 'dignity', 'adult']
    ),
    (
        'Yammy Yami Adult Diapers Large',
        'Nepi za Watu Wazima Kubwa',
        'Extra-large adult diapers for maximum comfort and protection. Breathable material prevents skin irritation.',
        'Nepi kubwa za watu wazima kwa starehe na ulinzi wa juu. Nyenzo zinazopumua zinazuia kuchafuka kwa ngozi.',
        adult_diapers_id,
        27000, 22000, 'Large', 18, '8 packs', 'Adult', '90-120 cm', 45, 'active', false,
        '/images/baby-diapers.png',
        ARRAY['extra-large', 'breathable', 'skin-protection', 'comfort']
    ),
    
    -- Lady Pads
    (
        'Yammy Yami Lady Pads Regular',
        'Pads za Wanawake za Kawaida',
        'Ultra-thin lady pads with superior absorption and comfort. Perfect for daily protection and confidence.',
        'Pads nyembamba za wanawake na unyonyaji bora na starehe. Zinafaa kwa ulinzi wa kila siku na ujasiri.',
        lady_pads_id,
        8000, 6500, 'Regular', 10, '20 packs', 'N/A', 'N/A', 200, 'active', true,
        '/images/lady-pads.png',
        ARRAY['ultra-thin', 'daily-protection', 'comfortable', 'confidence']
    ),
    (
        'Yammy Yami Lady Pads Super',
        'Pads za Wanawake za Juu',
        'Heavy-flow lady pads with extra absorption and leak protection. Designed for maximum security and comfort.',
        'Pads za wanawake kwa mtiririko mkubwa na unyonyaji wa ziada na ulinzi wa kuvuja. Zimeundwa kwa usalama na starehe wa juu.',
        lady_pads_id,
        10000, 8000, 'Super', 8, '20 packs', 'N/A', 'N/A', 150, 'active', false,
        '/images/lady-pads.png',
        ARRAY['heavy-flow', 'extra-absorption', 'leak-protection', 'security']
    ),
    (
        'Yammy Yami Lady Pads Night',
        'Pads za Wanawake za Usiku',
        'Extra-long night pads for overnight protection. Superior absorption and comfort for peaceful sleep.',
        'Pads ndefu za usiku kwa ulinzi wa usiku kucha. Unyonyaji bora na starehe kwa usingizi wa amani.',
        lady_pads_id,
        12000, 9500, 'Night', 6, '15 packs', 'N/A', 'N/A', 100, 'active', true,
        '/images/lady-pads.png',
        ARRAY['extra-long', 'overnight', 'peaceful-sleep', 'night-protection']
    );

    -- Insert some sample agents
    INSERT INTO agents (name, email, phone, location, region, status, commission_rate, total_sales) VALUES
    ('Hassan Mwalimu', 'hassan@example.com', '+255123456789', 'Dar es Salaam', 'Dar es Salaam', 'active', 15.00, 250000),
    ('Fatma Juma', 'fatma@example.com', '+255987654321', 'Arusha', 'Arusha', 'active', 12.50, 180000),
    ('Mohamed Ali', 'mohamed@example.com', '+255456789123', 'Mwanza', 'Mwanza', 'active', 10.00, 120000),
    ('Amina Said', 'amina@example.com', '+255789123456', 'Dodoma', 'Dodoma', 'pending', 10.00, 0),
    ('John Mwangi', 'john@example.com', '+255321654987', 'Mbeya', 'Mbeya', 'active', 12.00, 95000);

END $$;

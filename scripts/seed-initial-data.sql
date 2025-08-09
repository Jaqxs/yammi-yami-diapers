-- Insert categories first
INSERT INTO categories (id, name_en, name_sw, description_en, description_sw, slug, image_url, sort_order) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Baby Diapers',
  'Diapers za Watoto',
  'Premium quality diapers for babies',
  'Diapers za ubora wa juu kwa watoto',
  'baby-diapers',
  '/images/baby-diapers.png',
  1
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Baby Pants',
  'Pants za Watoto',
  'Comfortable baby pants for active toddlers',
  'Pants za watoto za starehe kwa watoto wanaocheza',
  'baby-pants',
  '/images/baby-diapers.png',
  2
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Lady Pads',
  'Pedi za Wanawake',
  'Comfortable and reliable feminine hygiene products',
  'Bidhaa za usafi wa kike zenye starehe na kuaminika',
  'lady-pads',
  '/images/lady-pads.png',
  3
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Adult Diapers',
  'Diapers za Watu Wazima',
  'Discreet and comfortable adult incontinence products',
  'Bidhaa za watu wazima zenye starehe na siri',
  'adult-diapers',
  '/images/diaper-features.png',
  4
);

-- Insert sample products
INSERT INTO products (
  id, name_en, name_sw, description_en, description_sw, category_id, 
  price, wholesale_price, agent_price, size, bundle_size, stock, 
  status, featured, image_url, sku, tags
) VALUES
-- Baby Diapers
(
  '660e8400-e29b-41d4-a716-446655440001',
  'Yammy Yami Baby Diapers Size 1',
  'Diapers za Yammy Yami Saizi 1',
  'Ultra-soft diapers for newborns (2-5kg). 12-hour protection with wetness indicator.',
  'Diapers laini sana kwa wazaliwa (2-5kg). Ulinzi wa masaa 12 na kiashiria cha unyevu.',
  '550e8400-e29b-41d4-a716-446655440001',
  8500.00, 7000.00, 6500.00, 'Size 1', 30, 150,
  'active', true, '/images/baby-diapers.png', 'YY-BD-S1-30',
  ARRAY['newborn', 'ultra-soft', '12-hour', 'wetness-indicator']
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  'Yammy Yami Baby Diapers Size 2',
  'Diapers za Yammy Yami Saizi 2',
  'Perfect fit diapers for babies (3-6kg). Advanced absorption technology.',
  'Diapers zinazofaa vizuri kwa watoto (3-6kg). Teknolojia ya hali ya juu ya kufyonza.',
  '550e8400-e29b-41d4-a716-446655440001',
  9000.00, 7500.00, 7000.00, 'Size 2', 30, 200,
  'active', true, '/images/baby-diapers.png', 'YY-BD-S2-30',
  ARRAY['baby', 'perfect-fit', 'advanced-absorption']
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  'Yammy Yami Baby Diapers Size 3',
  'Diapers za Yammy Yami Saizi 3',
  'Active baby diapers (4-9kg). Extra stretch for comfort and mobility.',
  'Diapers kwa watoto wenye kucheza (4-9kg). Nyongeza ya kunyoosha kwa starehe na uhamishaji.',
  '550e8400-e29b-41d4-a716-446655440001',
  9500.00, 8000.00, 7500.00, 'Size 3', 30, 180,
  'active', true, '/images/baby-diapers.png', 'YY-BD-S3-30',
  ARRAY['active-baby', 'extra-stretch', 'comfort']
),
(
  '660e8400-e29b-41d4-a716-446655440004',
  'Yammy Yami Baby Diapers Size 4',
  'Diapers za Yammy Yami Saizi 4',
  'Toddler diapers (7-18kg). Maximum absorption for active toddlers.',
  'Diapers za watoto wadogo (7-18kg). Ufyonzaji wa juu kwa watoto wanaocheza.',
  '550e8400-e29b-41d4-a716-446655440001',
  10000.00, 8500.00, 8000.00, 'Size 4', 30, 120,
  'active', false, '/images/baby-diapers.png', 'YY-BD-S4-30',
  ARRAY['toddler', 'maximum-absorption', 'active']
),

-- Baby Pants
(
  '660e8400-e29b-41d4-a716-446655440005',
  'Yammy Yami Baby Pants Size 3',
  'Pants za Yammy Yami Saizi 3',
  'Easy-to-wear pants for crawling babies (6-11kg). 360° stretch waistband.',
  'Pants rahisi kuvaa kwa watoto wanaokwea (6-11kg). Ukanda wa kiuno wa kunyoosha 360°.',
  '550e8400-e29b-41d4-a716-446655440002',
  11000.00, 9500.00, 9000.00, 'Size 3', 28, 100,
  'active', true, '/images/baby-diapers.png', 'YY-BP-S3-28',
  ARRAY['easy-wear', 'crawling', '360-stretch']
),
(
  '660e8400-e29b-41d4-a716-446655440006',
  'Yammy Yami Baby Pants Size 4',
  'Pants za Yammy Yami Saizi 4',
  'Training pants for walking toddlers (9-14kg). Easy tear-away sides.',
  'Pants za mazoezi kwa watoto wanaotembea (9-14kg). Pembeni zinazochanika kwa urahisi.',
  '550e8400-e29b-41d4-a716-446655440002',
  11500.00, 10000.00, 9500.00, 'Size 4', 28, 80,
  'active', false, '/images/baby-diapers.png', 'YY-BP-S4-28',
  ARRAY['training', 'walking', 'tear-away']
),

-- Lady Pads
(
  '660e8400-e29b-41d4-a716-446655440007',
  'Yammy Yami Ultra Thin Pads',
  'Pedi Nyembamba za Yammy Yami',
  'Ultra-thin pads with wings. Superior absorption and comfort.',
  'Pedi nyembamba zenye mabawa. Ufyonzaji wa hali ya juu na starehe.',
  '550e8400-e29b-41d4-a716-446655440003',
  3500.00, 3000.00, 2800.00, 'Regular', 10, 300,
  'active', true, '/images/lady-pads.png', 'YY-LP-UT-10',
  ARRAY['ultra-thin', 'wings', 'superior-absorption']
),
(
  '660e8400-e29b-41d4-a716-446655440008',
  'Yammy Yami Night Pads',
  'Pedi za Usiku za Yammy Yami',
  'Extra-long night pads for maximum protection. 8-hour comfort.',
  'Pedi ndefu za usiku kwa ulinzi wa juu. Starehe ya masaa 8.',
  '550e8400-e29b-41d4-a716-446655440003',
  4000.00, 3500.00, 3200.00, 'Night', 8, 250,
  'active', true, '/images/lady-pads.png', 'YY-LP-N-8',
  ARRAY['extra-long', 'night', 'maximum-protection', '8-hour']
),

-- Adult Diapers
(
  '660e8400-e29b-41d4-a716-446655440009',
  'Yammy Yami Adult Pants Medium',
  'Pants za Watu Wazima za Yammy Yami Wastani',
  'Discreet adult pants (70-110cm waist). Odor control technology.',
  'Pants za watu wazima za siri (kiuno 70-110cm). Teknolojia ya kudhibiti harufu.',
  '550e8400-e29b-41d4-a716-446655440004',
  15000.00, 13000.00, 12000.00, 'Medium', 20, 60,
  'active', false, '/images/diaper-features.png', 'YY-AD-M-20',
  ARRAY['discreet', 'adult', 'odor-control', 'medium']
),
(
  '660e8400-e29b-41d4-a716-446655440010',
  'Yammy Yami Adult Pants Large',
  'Pants za Watu Wazima za Yammy Yami Kubwa',
  'Comfortable adult pants (90-130cm waist). Maximum absorption capacity.',
  'Pants za watu wazima zenye starehe (kiuno 90-130cm). Uwezo wa juu wa kufyonza.',
  '550e8400-e29b-41d4-a716-446655440004',
  16000.00, 14000.00, 13000.00, 'Large', 20, 40,
  'active', false, '/images/diaper-features.png', 'YY-AD-L-20',
  ARRAY['comfortable', 'adult', 'maximum-absorption', 'large']
);

-- Insert some sample agents
INSERT INTO agents (
  id, agent_code, name, email, phone, whatsapp_number, 
  location, region, city, status, commission_rate, total_sales
) VALUES
(
  '770e8400-e29b-41d4-a716-446655440001',
  'YY001',
  'Hassan Mwalimu',
  'hassan@example.com',
  '+255773181863',
  '+255773181863',
  'Kariakoo Market',
  'Dar es Salaam',
  'Dar es Salaam',
  'active',
  10.00,
  0
),
(
  '770e8400-e29b-41d4-a716-446655440002',
  'YY002',
  'Fatuma Juma',
  'fatuma@example.com',
  '+255754123456',
  '+255754123456',
  'Mwenge Market',
  'Dar es Salaam',
  'Dar es Salaam',
  'active',
  10.00,
  0
);

-- Insert sample blog posts
INSERT INTO blog_posts (
  id, title_en, title_sw, slug, excerpt_en, excerpt_sw, 
  content_en, content_sw, author_name, category, status, featured
) VALUES
(
  '880e8400-e29b-41d4-a716-446655440001',
  'Choosing the Right Diaper Size',
  'Kuchagua Ukubwa Sahihi wa Diaper',
  'choosing-right-diaper-size',
  'Learn how to select the perfect diaper size for your baby.',
  'Jifunze jinsi ya kuchagua ukubwa kamili wa diaper kwa mtoto wako.',
  'Choosing the right diaper size is crucial for your baby''s comfort...',
  'Kuchagua ukubwa sahihi wa diaper ni muhimu kwa starehe ya mtoto wako...',
  'Dr. Sarah Johnson',
  'Baby Care',
  'published',
  true
);

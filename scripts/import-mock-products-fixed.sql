-- Clear existing products (optional, comment out if you want to keep existing products)
TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- Ensure the table has the correct structure
ALTER TABLE products ALTER COLUMN tags TYPE TEXT[];

-- Insert Baby Diapers - Side Tape
INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, weight_range, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Baby Diapers Side Tape - Small (S)',
  'Diapers za Watoto Side Tape - Ndogo (S)',
  'babyDiapers',
  18000,
  16000,
  'small',
  50,
  '4 bundles (200 pieces)',
  '4-8kg',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg',
  ARRAY['bestSeller', 'sideTape'],
  'Premium baby diapers with side tape closure for secure fit. Perfect for newborns and small babies.',
  'Diapers bora za watoto zenye utepe wa pembeni kwa usalama zaidi. Nzuri kwa watoto wachanga na wadogo.',
  120,
  'active',
  true
);

INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, weight_range, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Baby Diapers Side Tape - Medium (M)',
  'Diapers za Watoto Side Tape - Wastani (M)',
  'babyDiapers',
  18000,
  16000,
  'medium',
  48,
  '4 bundles (192 pieces)',
  '6-11kg',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg',
  ARRAY['bestSeller', 'sideTape'],
  'Medium size baby diapers with side tape for growing babies. Excellent absorption and comfort.',
  'Diapers za ukubwa wa wastani zenye utepe wa pembeni kwa watoto wanaokua. Unyonywaji na faraja bora.',
  95,
  'active',
  true
);

INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, weight_range, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Baby Diapers Side Tape - Large (L)',
  'Diapers za Watoto Side Tape - Kubwa (L)',
  'babyDiapers',
  18000,
  16000,
  'large',
  44,
  '4 bundles (176 pieces)',
  '9-14kg',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg',
  ARRAY['bestSeller', 'sideTape'],
  'Large size baby diapers with side tape for active toddlers. Superior protection and comfort.',
  'Diapers za ukubwa mkubwa zenye utepe wa pembeni kwa watoto wanaocheza. Ulinzi na faraja ya hali ya juu.',
  80,
  'active',
  false
);

INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, weight_range, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Baby Diapers Side Tape - Extra Large (XL)',
  'Diapers za Watoto Side Tape - Kubwa Zaidi (XL)',
  'babyDiapers',
  18000,
  16000,
  'extraLarge',
  40,
  '4 bundles (160 pieces)',
  '12-17kg',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg',
  ARRAY['sideTape'],
  'Extra large baby diapers with side tape for bigger toddlers. Maximum absorption and security.',
  'Diapers za ukubwa mkubwa zaidi zenye utepe wa pembeni kwa watoto wakubwa. Unyonywaji na usalama wa hali ya juu.',
  65,
  'active',
  false
);

-- Baby Pull-up Pants
INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, weight_range, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Baby Pull-up Pants - Medium (M)',
  'Pants za Watoto - Wastani (M)',
  'babyPants',
  20000,
  17000,
  'medium',
  50,
  '4 bundles (200 pieces)',
  '6-11kg',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1012.jpg-ES0dluaBooNTot5s1D4osLe125JMM4.jpeg',
  ARRAY['japanStandard', 'pullUp'],
  'Easy-to-wear pull-up pants for active babies. Japan standard quality with superior absorption.',
  'Pants rahisi kuvaa kwa watoto wanaocheza. Ubora wa kiwango cha Japani na unyonywaji bora.',
  85,
  'active',
  true
);

INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, weight_range, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Baby Pull-up Pants - Large (L)',
  'Pants za Watoto - Kubwa (L)',
  'babyPants',
  20000,
  17000,
  'large',
  50,
  '4 bundles (200 pieces)',
  '9-14kg',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1016.jpg-N7AFkyLYxdcxtB9xZpOyAB7xo2TYYZ.jpeg',
  ARRAY['bestSeller', 'pullUp'],
  'Large pull-up pants for growing toddlers. Easy to put on and take off with excellent fit.',
  'Pants za ukubwa mkubwa kwa watoto wanaokua. Rahisi kuvaa na kuvua na urafiki mzuri.',
  70,
  'active',
  false
);

INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, weight_range, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Baby Pull-up Pants - Extra Large (XL)',
  'Pants za Watoto - Kubwa Zaidi (XL)',
  'babyPants',
  20000,
  17000,
  'extraLarge',
  50,
  '4 bundles (200 pieces)',
  '12-17kg',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1009.jpg-BIK0Z64A1WCzCs1Id2cgiGSKGHHL2Z.jpeg',
  ARRAY['japanStandard', 'pullUp'],
  'Extra large pull-up pants for bigger toddlers. Premium quality with maximum comfort and protection.',
  'Pants za ukubwa mkubwa zaidi kwa watoto wakubwa. Ubora wa hali ya juu na faraja na ulinzi wa hali ya juu.',
  55,
  'active',
  false
);

-- Premium Royal Baby Pants
INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, weight_range, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Premium Royal Baby Pants - Large (L)',
  'Pants Bora za Kifalme za Watoto - Kubwa (L)',
  'babyPants',
  22000,
  19000,
  'large',
  50,
  '4 bundles (200 pieces)',
  '9-14kg',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1011.jpg-kyHylrVCgJKZGHSxfOAMQ6GEz7jRUZ.jpeg',
  ARRAY['bestSeller', 'premium', 'royal'],
  'Our highest quality royal pants with premium absorption and extra softness. Royal quality for your baby.',
  'Pants zetu za ubora wa juu zaidi za kifalme zenye unyonywaji wa hali ya juu na ulaini wa ziada. Ubora wa kifalme kwa mtoto wako.',
  40,
  'active',
  true
);

-- Adult Diapers/Pants
INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, hip_size, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Adult Pants - Large (L)',
  'Pants za Watu Wazima - Kubwa (L)',
  'adultDiapers',
  25000,
  22000,
  'large',
  20,
  '4 bundles (80 pieces)',
  '80-105cm',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1022.jpg-ACW4aUFuZSJnBBpx7KHHpriGFYTAgE.jpeg',
  ARRAY['internationalQuality', 'adult'],
  'Comfortable adult pants for those with mobility issues or incontinence. International quality standards.',
  'Pants za watu wazima zenye faraja kwa wenye matatizo ya kutembea au kukojoa bila kujizuia. Viwango vya kimataifa.',
  30,
  'active',
  true
);

INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, hip_size, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Adult Pants - Extra Large (XL)',
  'Pants za Watu Wazima - Kubwa Zaidi (XL)',
  'adultDiapers',
  28000,
  25000,
  'extraLarge',
  20,
  '4 bundles (80 pieces)',
  '105-130cm',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1020.jpg-d0BiyLZoj7T35mr3ZDsASJHCNLsn9j.jpeg',
  ARRAY['internationalQuality', 'adult'],
  'Extra large adult pants for maximum comfort and protection. Perfect for larger individuals.',
  'Pants kubwa zaidi za watu wazima kwa faraja na ulinzi wa hali ya juu. Nzuri kwa watu wakubwa.',
  25,
  'active',
  false
);

INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, hip_size, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Adult Pants - XXL',
  'Pants za Watu Wazima - XXL',
  'adultDiapers',
  30000,
  27000,
  'extraLarge',
  20,
  '4 bundles (80 pieces)',
  '>130cm',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1020.jpg-d0BiyLZoj7T35mr3ZDsASJHCNLsn9j.jpeg',
  ARRAY['internationalQuality', 'adult', 'xxl'],
  'XXL adult pants for maximum comfort and protection. Our largest size for ultimate coverage.',
  'Pants za XXL za watu wazima kwa faraja na ulinzi wa hali ya juu. Ukubwa wetu mkubwa zaidi kwa ufunikaji kamili.',
  20,
  'active',
  false
);

-- Baby Wipes
INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  bundle_size, carton_size, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Baby Wipes - 120 Sheets',
  'Wipes za Watoto - Karatasi 120',
  'babyDiapers',
  4000,
  3500,
  120,
  '24 packs',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1025.jpg-AhNojXnbDx5fyKY8p4xiXzW0sMdXk0.jpeg',
  ARRAY['newArrival', 'wipes'],
  'Soft and gentle baby wipes for cleaning your baby''s delicate skin. Pack of 120 sheets.',
  'Wipes laini na nyororo kwa kusafisha ngozi nyeti ya mtoto wako. Pakiti ya karatasi 120.',
  200,
  'active',
  true
);

-- Special Baby Diaper XXXL
INSERT INTO products (
  name_en, name_sw, category, price, wholesale_price, 
  size, bundle_size, carton_size, weight_range, image_url, 
  tags, description_en, description_sw, stock, status, featured
) VALUES (
  'Baby Diaper XXXL (19kg+)',
  'Diaper za Watoto XXXL (19kg+)',
  'babyPants',
  24000,
  21000,
  'extraLarge',
  50,
  '4 bundles (200 pieces)',
  '19kg+',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1015.jpg-MrDwEHu3Gt9fjrXcq7CwoswxVdePaz.jpeg',
  ARRAY['newArrival', 'xxxl'],
  'Our largest size baby diapers for older toddlers. Maximum comfort and absorption for active children.',
  'Diaper zetu za ukubwa mkubwa zaidi kwa watoto wakubwa. Faraja na unyonywaji wa hali ya juu kwa watoto wanaocheza.',
  30,
  'active',
  false
);

-- Update sequence to match the highest ID
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

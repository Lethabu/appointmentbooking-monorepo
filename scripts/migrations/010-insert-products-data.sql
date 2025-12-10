-- Populate InStyle Hair Boutique Products
-- Based on provided pricelist from images

-- First, create product categories
INSERT OR IGNORE INTO product_categories (tenant_id, name, slug, description, display_order) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Bobs & Short Styles', 'bobs', 'Stylish bob wigs and short hairstyles', 1),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Curls & Textured', 'curls', 'Beautiful curly and textured wigs', 2),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Straight Wigs', 'straight-wigs', 'Sleek straight hair bundles with closure', 3),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Curly Wigs', 'curly-wigs', 'Luscious curly hair bundles with closure', 4),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Closures & Frontals', 'closures', 'Ear to ear closures and frontals', 5),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Premium Styles', 'premium', 'Factory made and premium wigs', 6),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Other Styles', 'other-styles', 'Unique styles and special pieces', 7);

-- Insert Bobs & Short Styles
INSERT OR IGNORE INTO products (tenant_id, category_id, name, description, price, requires_installation, installation_price, sku, length_value, tags) VALUES
-- Bobs
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='bobs' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 '10" Double Drawn Bob', 'Premium double drawn bob wig with full, thick hair from root to tip', 
 180000, 1, 25000, 'BOB-DD-10', '10"', '["bob","double-drawn","10-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='bobs' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 '10" Bob Grade 15A', '10 inch Grade 15A quality bob wig', 
 85000, 1, 25000, 'BOB-15A-10', '10"', '["bob","grade-15a","10-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='bobs' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Piano Bob DD', 'Stunning piano color double drawn bob', 
 140000, 1, 25000, 'BOB-PIANO-DD', '10"', '["bob","piano","double-drawn","10-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='bobs' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 '10" Burgundy Bob', 'Beautiful burgundy colored bob wig', 
 140000, 1, 25000, 'BOB-BURG-10', '10"', '["bob","burgundy","colored","10-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='bobs' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Grade 15A 8" Brown Bob', 'Grade 15A brown bob, 8 inches', 
 75000, 1, 25000, 'BOB-15A-8-BR', '8"', '["bob","brown","grade-15a","8-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='bobs' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Grey 15A 8" Grey Bob', 'Trendy grey bob wig, Grade 15A quality', 
 125000, 1, 25000, 'BOB-15A-8-GR', '8"', '["bob","grey","grade-15a","8-inch","colored"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='bobs' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Double Drawn Bob Premium', 'Premium double drawn bob wig', 
 250000, 1, 25000, 'BOB-DD-PREM', NULL, '["bob","double-drawn","premium"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='bobs' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Pixie', 'Short and chic pixie cut wig', 
 75000, 1, 25000, 'PIXIE-01', NULL, '["pixie","short","chic"]');

-- Insert Curls & Textured Styles
INSERT OR IGNORE INTO products (tenant_id, category_id, name, description, price, requires_installation, installation_price, texture, tags) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curls' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Grade 15A Curls', 'High quality Grade 15A curly wig', 
 135000, 1, 50000, 'Curly', '["curls","grade-15a","textured"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curls' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Burgundy Curls', 'Gorgeous burgundy curly wig', 
 135000, 1, 50000, 'Curly', '["curls","burgundy","colored","textured"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curls' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Double Drawn Curls', 'Premium double drawn curly wig', 
 160000, 1, 50000, 'Curly', '["curls","double-drawn","premium"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curls' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 '13x1 Pixie Curl', 'Pixie cut with beautiful curls', 
 55000, 1, 20000, 'Curly', '["pixie","curls","short"]');

-- Note: Straight and Curly wigs are inserted in bulk in a separate script due to size
-- See: 011-insert-wig-bundles.sql

-- Insert Other Styles & Premium Products
INSERT OR IGNORE INTO products (tenant_id, category_id, name, description, price, requires_installation, installation_price, factory_made, tags) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='other-styles' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Frontal Ponytail', 'Sleek frontal ponytail style', 
 95000, 0, 0, 0, '["ponytail","frontal","sleek"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='other-styles' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Gel Phondo', 'Traditional gel phondo styling', 
 35000, 0, 0, 0, '["phondo","traditional","styling"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='other-styles' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Barbie Gel Phondo', 'Barbie-style gel phondo', 
 40000, 0, 0, 0, '["phondo","barbie","styling"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='premium' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'MAGOGO WIG', 'Traditional MAGOGO style wig with installation', 
 130000, 0, 0, 0, '["magogo","traditional","includes-install"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='premium' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 '14" Two Tone Factory Made', 'Factory made two tone wig, 14 inches', 
 200000, 1, 25000, 1, '["factory-made","two-tone","14-inch","premium"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='premium' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Double Drawn Straight Factory Made', 'Factory made double drawn straight wig', 
 160000, 1, 25000, 1, '["factory-made","double-drawn","straight","premium"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='premium' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Grade 12A Factory Made', 'Grade 12A factory made wig', 
 130000, 1, 25000, 1, '["factory-made","grade-12a","premium"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 '5x5 HD Lace', 'Premium 5x5 HD lace closure', 
 420000, 0, 0, 0, '["closure","hd-lace","5x5","premium"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='other-styles' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Two Tone Orange Bob', 'Vibrant two tone orange bob', 
 140000, 1, 25000, 0, '["bob","two-tone","orange","colored"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='other-styles' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Soft Glam', 'Soft glam style', 
 45000, 0, 0, 0, '["soft-glam","styling"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs' AND tenant_id='ccb12b4d-ade6-467d-a614-7c9d198ddc70'), 
 'Double Drawn 26"', 'Double drawn straight wig, 26 inches', 
 390000, 1, 25000, 0, '["straight","double-drawn","26-inch","long"]');

-- Insert Straight and Curly Wig Bundles with Closures
-- Based on pricelist images 1000308839.jpg and 1000308840.jpg

-- Straight Wigs with 3-Way Closure
INSERT OR IGNORE INTO products (tenant_id, category_id, name, description, price, requires_installation, installation_price, length_value, hair_type, texture, closure_type, tags) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '10" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 10 inches', 
 180000, 1, 25000, '10"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","10-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '12" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 12 inches', 
 200000, 1, 25000, '12"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","12-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '14" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 14 inches', 
 220000, 1, 25000, '14"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","14-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '16" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 16 inches', 
 240000, 1, 25000, '16"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","16-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '18" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 18 inches', 
 260000, 1, 25000, '18"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","18-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '20" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 20 inches', 
 290000, 1, 25000, '20"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","20-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '22" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 22 inches', 
 310000, 1, 25000, '22"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","22-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '24" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 24 inches', 
 340000, 1, 25000, '24"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","24-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '26" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 26 inches', 
 360000, 1, 25000, '26"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","26-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '28" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 28 inches', 
 380000, 1, 25000, '28"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","28-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '30" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 30 inches', 
 410000, 1, 25000, '30"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","30-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '32" Straight Bundles + 3-Way Closure', 'Brazilian/Peruvian straight hair bundles with 3-way closure, 32 inches', 
 430000, 1, 25000, '32"', 'Brazilian/Peruvian', 'Straight', '3-Way Closure', '["straight","bundles","3-way-closure","32-inch"]');

-- Straight Wigs with Regular Closure (Luxury Grade 14A)
INSERT OR IGNORE INTO products (tenant_id, category_id, name, description, price, requires_installation, installation_price, length_value, hair_type, texture, closure_type, tags) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '10" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 10 inches', 
 200000, 1, 25000, '10"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","10-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '12" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 12 inches', 
 220000, 1, 25000, '12"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","12-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '14" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 14 inches', 
 230000, 1, 25000, '14"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","14-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '16" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 16 inches', 
 250000, 1, 25000, '16"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","16-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '18" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 18 inches', 
 280000, 1, 25000, '18"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","18-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '20" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 20 inches', 
 320000, 1, 25000, '20"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","20-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '22" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 22 inches', 
 340000, 1, 25000, '22"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","22-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '24" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 24 inches', 
 370000, 1, 25000, '24"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","24-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '26" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 26 inches', 
 420000, 1, 25000, '26"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","26-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '28" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 28 inches', 
 460000, 1, 25000, '28"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","28-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '30" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 30 inches', 
 485000, 1, 25000, '30"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","30-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='straight-wigs'), 
 '32" Luxury Grade 14A Straight + Closure', 'Luxury Brazilian/Peruvian Grade 14A straight hair with closure, 32 inches', 
 520000, 1, 25000, '32"', 'Brazilian/Peruvian 14A', 'Straight', 'Regular Closure', '["straight","bundles","luxury","grade-14a","32-inch"]');

-- Curly Wigs with Closure
INSERT OR IGNORE INTO products (tenant_id, category_id, name, description, price, requires_installation, installation_price, length_value, texture, closure_type, tags) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '10" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 10 inches', 
 160000, 1, 50000, '10"', 'Curly', 'Regular Closure', '["curly","bundles","10-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '12" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 12 inches', 
 180000, 1, 50000, '12"', 'Curly', 'Regular Closure', '["curly","bundles","12-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '14" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 14 inches', 
 235000, 1, 50000, '14"', 'Curly', 'Regular Closure', '["curly","bundles","14-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '16" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 16 inches', 
 270000, 1, 50000, '16"', 'Curly', 'Regular Closure', '["curly","bundles","16-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '18" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 18 inches', 
 310000, 1, 50000, '18"', 'Curly', 'Regular Closure', '["curly","bundles","18-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '20" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 20 inches', 
 345000, 1, 50000, '20"', 'Curly', 'Regular Closure', '["curly","bundles","20-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '22" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 22 inches', 
 360000, 1, 50000, '22"', 'Curly', 'Regular Closure', '["curly","bundles","22-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '24" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 24 inches', 
 400000, 1, 50000, '24"', 'Curly', 'Regular Closure', '["curly","bundles","24-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '26" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 26 inches', 
 435000, 1, 50000, '26"', 'Curly', 'Regular Closure', '["curly","bundles","26-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '28" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 28 inches', 
 470000, 1, 50000, '28"', 'Curly', 'Regular Closure', '["curly","bundles","28-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '30" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 30 inches', 
 520000, 1, 50000, '30"', 'Curly', 'Regular Closure', '["curly","bundles","30-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='curly-wigs'), 
 '32" Curly Bundles + Closure', 'Beautiful curly hair bundles with closure, 32 inches', 
 565000, 1, 50000, '32"', 'Curly', 'Regular Closure', '["curly","bundles","32-inch"]');

-- Ear to Ear Closures (Sold Separately)
-- For Straight Wigs (3-Way Closure)
INSERT OR IGNORE INTO products (tenant_id, category_id, name, description, price, length_value, closure_type, tags) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '10" Ear to Ear Closure (Straight)', 'Ear to ear closure for straight wigs, 10 inches', 
 45000, '10"', 'Ear to Ear', '["closure","ear-to-ear","straight","10-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '12" Ear to Ear Closure (Straight)', 'Ear to ear closure for straight wigs, 12 inches', 
 55000, '12"', 'Ear to Ear', '["closure","ear-to-ear","straight","12-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '14" Ear to Ear Closure (Straight)', 'Ear to ear closure for straight wigs, 14 inches', 
 65000, '14"', 'Ear to Ear', '["closure","ear-to-ear","straight","14-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '16" Ear to Ear Closure (Straight)', 'Ear to ear closure for straight wigs, 16 inches', 
 85000, '16"', 'Ear to Ear', '["closure","ear-to-ear","straight","16-inch"]'),

-- For Straight Wigs (Luxury Grade 14A)
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '10" Luxury Ear to Ear Closure (Straight)', 'Luxury ear to ear closure for straight wigs, 10 inches', 
 75000, '10"', 'Ear to Ear Luxury', '["closure","ear-to-ear","straight","luxury","10-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '12" Luxury Ear to Ear Closure (Straight)', 'Luxury ear to ear closure for straight wigs, 12 inches', 
 85000, '12"', 'Ear to Ear Luxury', '["closure","ear-to-ear","straight","luxury","12-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '14" Luxury Ear to Ear Closure (Straight)', 'Luxury ear to ear closure for straight wigs, 14 inches', 
 95000, '14"', 'Ear to Ear Luxury', '["closure","ear-to-ear","straight","luxury","14-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '16" Luxury Ear to Ear Closure (Straight)', 'Luxury ear to ear closure for straight wigs, 16 inches', 
 115000, '16"', 'Ear to Ear Luxury', '["closure","ear-to-ear","straight","luxury","16-inch"]'),

-- For Curly Wigs
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '10" Ear to Ear Closure (Curly)', 'Ear to ear closure for curly wigs, 10 inches', 
 55000, '10"', 'Ear to Ear Curly', '["closure","ear-to-ear","curly","10-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '12" Ear to Ear Closure (Curly)', 'Ear to ear closure for curly wigs, 12 inches', 
 65000, '12"', 'Ear to Ear Curly', '["closure","ear-to-ear","curly","12-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '14" Ear to Ear Closure (Curly)', 'Ear to ear closure for curly wigs, 14 inches', 
 85000, '14"', 'Ear to Ear Curly', '["closure","ear-to-ear","curly","14-inch"]'),

('ccb12b4d-ade6-467d-a614-7c9d198ddc70', (SELECT id FROM product_categories WHERE slug='closures'), 
 '16" Ear to Ear Closure (Curly)', 'Ear to ear closure for curly wigs, 16 inches', 
 95000, '16"', 'Ear to Ear Curly', '["closure","ear-to-ear","curly","16-inch"]');

-- File: scripts/migrations/004-safe-instyle-sync.sql
-- Safe migration: Delete related data first, then services, then recreate everything

-- Step 1: Delete appointments first (to avoid foreign key constraints)
DELETE FROM appointments WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

-- Step 2: Delete services for the Instyle tenant
DELETE FROM services WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

-- Step 3: Insert the 5 CORRECT services with prices in cents
INSERT INTO services (id, tenant_id, name, description, price, duration_minutes) VALUES
('middle-side-installation', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Middle & Side Installation', 'Professional hair installation service for middle and side parts', 30000, 60),
('maphondo-lines-installation', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maphondo & Lines Installation', 'Traditional African hairstyling with intricate patterns', 35000, 60),
('soft-glam-makeup', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Soft Glam Makeup', 'Professional makeup application service', 45000, 120),
('gel-maphondo-styling', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Gel Maphondo Styling', 'Gel-based traditional styling service', 35000, 120),
('frontal-ponytail-installation', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Frontal Ponytail Installation', 'Premium frontal ponytail installation service', 95000, 120);

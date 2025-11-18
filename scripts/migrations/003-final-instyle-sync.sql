-- File: scripts/migrations/003-final-instyle-sync.sql
-- Deletes all existing services for the Instyle tenant to prevent duplicates.
DELETE FROM services WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

-- Inserts the 5 CORRECT services with prices in cents.
INSERT INTO services (tenant_id, name, description, price, duration_minutes) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Middle & Side Installation', 'Professional hair installation service for middle and side parts', 30000, 60),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maphondo & Lines Installation', 'Traditional African hairstyling with intricate patterns', 35000, 60),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Soft Glam Makeup', 'Professional makeup application service', 45000, 120),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Gel Maphondo Styling', 'Gel-based traditional styling service', 35000, 120),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Frontal Ponytail Installation', 'Premium frontal ponytail installation service', 95000, 120);
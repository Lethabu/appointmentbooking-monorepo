-- Update services with ACTUAL SuperSaaS data (from booking analysis)
-- Only 2 services are actively used with confirmed pricing

DELETE FROM services WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

-- Insert ACTUAL services with confirmed pricing from SuperSaaS bookings
INSERT INTO services (tenant_id, name, description, price, duration_minutes) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Middle & Side Installation', 'Professional hair installation service for middle and side parts', 30000, 60),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maphondo & Lines Installation', 'Traditional African hairstyling with intricate patterns', 35000, 60);

-- Note: Other services (Soft Glam Makeup, Gel Maphondo Styling, Frontal Ponytail Installation) 
-- exist in SuperSaaS but have no booking history, so pricing/duration unknown
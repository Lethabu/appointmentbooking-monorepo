-- Migration: Create staff schedules table
-- Enhanced staff scheduling beyond SuperSaaS limitations
-- Allows flexible schedule management for multi-staff salons

-- Create the staff_schedules table for advanced schedule management
CREATE TABLE staff_schedules (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    staff_name TEXT, -- NULLABLE to allow for general/non-assigned slots
    service_id TEXT NOT NULL,
    start_time TEXT NOT NULL, -- Format: 'HH:MM'
    end_time TEXT NOT NULL,   -- Format: 'HH:MM'
    day_of_week INTEGER NOT NULL, -- ISO 8601: 1=Monday, 7=Sunday
    is_available INTEGER DEFAULT 1,
    created_at INTEGER,
    updated_at INTEGER
);

-- Best Practice: Optimized indexing for performance
CREATE INDEX idx_staff_schedules_tenant_day
    ON staff_schedules (tenant_id, day_of_week, is_available);

CREATE INDEX idx_staff_schedules_staff_name
    ON staff_schedules (tenant_id, staff_name);

CREATE INDEX idx_staff_schedules_service
    ON staff_schedules (service_id);

-- Insert sample schedules for Instyle Hair Boutique
-- This demonstrates the functionality for the tenant
INSERT INTO staff_schedules (
    id, tenant_id, staff_name, service_id, start_time, end_time, day_of_week
) VALUES
-- Thandi Mthembu's schedule (Monday - Friday)
('sch_thandi_mon', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thandi Mthembu', 'service-middle-installation', '09:00', '17:00', 1),
('sch_thandi_tue', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thandi Mthembu', 'service-middle-installation', '09:00', '17:00', 2),
('sch_thandi_wed', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thandi Mthembu', 'service-middle-installation', '09:00', '17:00', 3),
('sch_thandi_thu', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thandi Mthembu', 'service-middle-installation', '09:00', '17:00', 4),
('sch_thandi_fri', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thandi Mthembu', 'service-middle-installation', '09:00', '17:00', 5),

-- Nomsa Dlamini's schedule (Tuesday - Saturday)
('sch_nomsa_tue', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nomsa Dlamini', 'service-maphondo-lines', '10:00', '18:00', 2),
('sch_nomsa_wed', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nomsa Dlamini', 'service-maphondo-lines', '10:00', '18:00', 3),
('sch_nomsa_thu', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nomsa Dlamini', 'service-maphondo-lines', '10:00', '18:00', 4),
('sch_nomsa_fri', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nomsa Dlamini', 'service-maphondo-lines', '10:00', '18:00', 5),
('sch_nomsa_sat', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nomsa Dlamini', 'service-maphondo-lines', '08:00', '16:00', 6),

-- General availability slots (no specific staff assigned)
('sch_general_mon_am', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', NULL, 'service-soft-glam', '09:00', '12:00', 1),
('sch_general_mon_pm', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', NULL, 'service-soft-glam', '14:00', '17:00', 1),
('sch_general_sat_am', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', NULL, 'service-gel-maphondo', '08:00', '12:00', 6);

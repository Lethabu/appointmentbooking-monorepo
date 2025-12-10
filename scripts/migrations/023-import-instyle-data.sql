-- Instyle Hair Boutique Data Import
-- Migration: 023-import-instyle-data.sql
-- This is a one-time data load for tenant: ccb12b4d-ade6-467d-a614-7c9d198ddc70

-- ============================================================================
-- Step 1: Verify Services Already Exist (created in migration 001)
-- ============================================================================

-- Services should already exist from 001-create-d1-schema.sql
-- If missing, uncomment below:
-- INSERT OR IGNORE INTO services (tenant_id, name, description, price, duration_minutes) VALUES
-- ('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Middle & Side Installation', 'Professional hair installation service', 30000, 60),
-- ('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maphondo & Lines Installation', 'Traditional African hairstyling with intricate patterns', 35000, 60),
-- ('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Soft Glam Makeup', 'Professional makeup application service', 45000, 120),
-- ('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Gel Maphondo Styling', 'Gel-based traditional styling service', 35000, 120),
-- ('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Frontal Ponytail Installation', 'Premium frontal ponytail installation service', 95000, 120);

-- ============================================================================
-- Step 2: Insert Staff Members into users table
-- ============================================================================

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES
  ('staff_instyle_zindzi', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zindzi', 'zindzi@instylehairboutique.co.za', '+27 (0)21 123 4567', (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('staff_instyle_noma', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Noma', 'noma@instylehairboutique.co.za', '+27 (0)21 234 5678', (strftime('%s', 'now')), (strftime('%s', 'now')));

-- ============================================================================
-- Step 3: Insert Weekly Staff Schedules
-- ============================================================================

-- Zindzi: Monday-Saturday, 9:00 AM - 5:00 PM (except Saturday 8:00 AM - 4:00 PM)
-- Schedule for all Instyle services (flexible across service types)
INSERT OR IGNORE INTO staff_schedules (id, tenant_id, staff_name, service_id, day_of_week, start_time, end_time, is_available, created_at, updated_at)
VALUES
  ('sch_zindzi_mon', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zindzi', 'all', 1, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_zindzi_tue', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zindzi', 'all', 2, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_zindzi_wed', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zindzi', 'all', 3, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_zindzi_thu', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zindzi', 'all', 4, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_zindzi_fri', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zindzi', 'all', 5, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_zindzi_sat', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zindzi', 'all', 6, '08:00', '16:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  
  -- Noma: Tuesday-Saturday, 10:00 AM - 6:00 PM
  ('sch_noma_tue', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Noma', 'all', 2, '10:00', '18:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_noma_wed', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Noma', 'all', 3, '10:00', '18:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_noma_thu', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Noma', 'all', 4, '10:00', '18:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_noma_fri', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Noma', 'all', 5, '10:00', '18:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now'))),
  ('sch_noma_sat', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Noma', 'all', 6, '09:00', '17:00', 1, (strftime('%s', 'now')), (strftime('%s', 'now')));

-- ============================================================================
-- Step 4: Verify Import
-- ============================================================================

-- Count imported records (run after import)
-- SELECT 'Services' as table_name, COUNT(*) as count FROM services WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
-- UNION ALL
-- SELECT 'Staff (users)' as table_name, COUNT(*) as count FROM users WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
-- UNION ALL
-- SELECT 'Schedules' as table_name, COUNT(*) as count FROM staff_schedules WHERE tenant_id = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

-- Expected output:
-- Services: 5 (from migration 001)
-- Staff (users): 2
-- Schedules: 11


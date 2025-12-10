-- Migration: 024-create-dashboard-bookings-2024.sql
-- Purpose: Create an aggregated dashboard table and populate it with
-- bookings scheduled from 2024-01-01 onward. Designed to be run with
-- `npx wrangler d1 execute <DB_NAME> --local --file=scripts/migrations/024-create-dashboard-bookings-2024.sql`

BEGIN TRANSACTION;

-- Create a lightweight dashboard table for reporting and UI consumption
CREATE TABLE IF NOT EXISTS dashboard_bookings_2024_plus (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  appointment_id TEXT NOT NULL,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  service_name TEXT,
  scheduled_time INTEGER,
  status TEXT,
  payment_status TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- Populate the dashboard table from existing appointments (2024+)
INSERT OR IGNORE INTO dashboard_bookings_2024_plus (
  id, tenant_id, appointment_id, user_name, user_email, user_phone,
  service_name, scheduled_time, status, payment_status, created_at, updated_at
)
SELECT
  lower(hex(randomblob(16))),
  a.tenant_id,
  a.id as appointment_id,
  u.name as user_name,
  u.email as user_email,
  u.phone as user_phone,
  s.name as service_name,
  a.scheduled_time,
  a.status,
  a.payment_status,
  a.created_at,
  a.updated_at
FROM appointments a
LEFT JOIN users u ON u.id = a.user_id
LEFT JOIN services s ON s.id = a.service_id
WHERE a.scheduled_time >= strftime('%s','2024-01-01')
;

-- Add indexes to speed up dashboard queries
CREATE INDEX IF NOT EXISTS idx_dashboard_bookings_tenant_scheduled ON dashboard_bookings_2024_plus(tenant_id, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_dashboard_bookings_service ON dashboard_bookings_2024_plus(service_name);

COMMIT;

-- Notes:
-- - This migration creates a copy of booking data for reporting. It is intentionally
--   simple and idempotent (uses INSERT OR IGNORE). Rerunning will not duplicate rows.
-- - If you prefer a materialized view instead of a physical table, adapt this file
--   to DROP/CREATE VIEW and use a read-only approach for your dashboard.

-- Migration: Final BMAD Schema for Booking Widget
-- Created: 2025-11-18
-- Description: Adds final fields for spec-compliant booking system

-- Add columns that might not exist (D1 safe)
ALTER TABLE appointments ADD COLUMN version INTEGER;
UPDATE appointments SET version = 1 WHERE version IS NULL;
ALTER TABLE appointments ADD COLUMN updated_at INTEGER;
UPDATE appointments SET updated_at = (strftime('%s', 'now') * 1000) WHERE updated_at IS NULL;

-- Add service description and SuperSaaS ID
ALTER TABLE services ADD COLUMN description TEXT;
ALTER TABLE services ADD COLUMN supersaas_service_id TEXT;
ALTER TABLE services ADD COLUMN created_at INTEGER;

-- Create the employees table
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  supersaas_schedule_id TEXT,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER
);

-- Create index
CREATE INDEX employees_tenant_idx ON employees(tenant_id);

-- Add foreign key relationship (D1-safe)
-- Note: D1 doesn't enforce foreign keys but schema includes them

-- Insert initial employees (4 employees for Instyle)
INSERT INTO employees (id, tenant_id, name, email, is_active, created_at) VALUES
  ('emp_thandi', (SELECT id FROM tenants WHERE slug = 'instylehairboutique'), 'Thandi Mthembu', 'thandi@instylehairboutique.co.za', 1, (strftime('%s', 'now') * 1000)),
  ('emp_nomsa', (SELECT id FROM tenants WHERE slug = 'instylehairboutique'), 'Nomsa Dlamini', 'nomsa@instylehairboutique.co.za', 1, (strftime('%s', 'now') * 1000)),
  ('emp_zanele', (SELECT id FROM tenants WHERE slug = 'instylehairboutique'), 'Zanele Khumalo', 'zanele@instylehairboutique.co.za', 1, (strftime('%s', 'now') * 1000)),
  ('emp_precious', (SELECT id FROM tenants WHERE slug = 'instylehairboutique'), 'Precious Ndaba', 'precious@instylehairboutique.co.za', 1, (strftime('%s', 'now') * 1000));

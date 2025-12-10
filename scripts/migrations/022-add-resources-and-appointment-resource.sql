-- Migration: add resources table and optional resource_id columns
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'staff', -- resource type: staff/room/other
  meta TEXT DEFAULT '{}', -- JSON blob for extensibility
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Add a nullable resource_id to appointments to support per-resource assignment
ALTER TABLE appointments ADD COLUMN resource_id TEXT DEFAULT NULL;

-- Add a nullable resource_id to staff_schedules so schedules can be tied to a resource
ALTER TABLE staff_schedules ADD COLUMN resource_id TEXT DEFAULT NULL;

-- Indexes to speed queries
CREATE INDEX IF NOT EXISTS idx_resources_tenant ON resources(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_resource_id ON appointments(resource_id);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_resource_id ON staff_schedules(resource_id);
-- Migration 022: Add resources table and optional resource_id on appointments
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'resource', -- e.g. stylist, room, equipment
  meta TEXT DEFAULT '{}', -- JSON metadata
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Add optional resource_id to appointments to support per-resource assignment
ALTER TABLE appointments RENAME TO _appointments_old_022;

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  service_id TEXT NOT NULL,
  scheduled_time INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_reference TEXT,
  supersaas_booking_id TEXT,
  resource_id TEXT, -- optional reference to resources.id
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (resource_id) REFERENCES resources(id)
);

-- Copy data from old appointments into new table (resource_id will be NULL)
INSERT INTO appointments (id, tenant_id, user_id, service_id, scheduled_time, status, notes, payment_status, payment_reference, supersaas_booking_id, created_at, updated_at)
SELECT id, tenant_id, user_id, service_id, scheduled_time, status, notes, payment_status, payment_reference, supersaas_booking_id, created_at, updated_at FROM _appointments_old_022;

-- Drop old table
DROP TABLE IF EXISTS _appointments_old_022;

-- Index for resource lookups
CREATE INDEX IF NOT EXISTS idx_resources_tenant_id ON resources(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_resource_id ON appointments(resource_id);

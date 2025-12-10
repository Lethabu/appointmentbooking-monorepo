-- Migration: create staff_schedules table
CREATE TABLE IF NOT EXISTS staff_schedules (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    staff_name TEXT,
    service_id TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    day_of_week INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at INTEGER DEFAULT (strftime('%s','now')),
    updated_at INTEGER DEFAULT (strftime('%s','now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX IF NOT EXISTS idx_staff_schedules_tenant ON staff_schedules(tenant_id);

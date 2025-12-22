-- Migration: 026-rbac-system.sql
-- Description: Implement comprehensive Role-Based Access Control (RBAC) system
-- Date: 2025-12-16

-- ========================================
-- ROLE-BASED ACCESS CONTROL (RBAC) SYSTEM
-- ========================================

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  permissions TEXT DEFAULT '[]', -- JSON array of permission strings
  is_system_role INTEGER DEFAULT 0, -- BOOLEAN: 1 for system roles, 0 for custom
  is_active INTEGER DEFAULT 1, -- BOOLEAN
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Create indexes for roles table
CREATE INDEX IF NOT EXISTS roles_tenant_idx ON roles(tenant_id);
CREATE INDEX IF NOT EXISTS roles_name_idx ON roles(name);
CREATE INDEX IF NOT EXISTS roles_system_idx ON roles(is_system_role);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by TEXT REFERENCES users(id), -- Who assigned this role
  assigned_at INTEGER DEFAULT (unixepoch()),
  expires_at INTEGER, -- Optional expiration timestamp
  is_active INTEGER DEFAULT 1, -- BOOLEAN
  UNIQUE(user_id, role_id) -- Prevent duplicate role assignments
);

-- Create indexes for user_roles table
CREATE INDEX IF NOT EXISTS user_roles_user_idx ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS user_roles_composite_idx ON user_roles(user_id, role_id);

-- Create role audit log table
CREATE TABLE IF NOT EXISTS role_audit_log (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id), -- User who made the change
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'assign', 'revoke'
  resource_type TEXT NOT NULL, -- 'role', 'user_role', 'permission'
  resource_id TEXT NOT NULL,
  old_value TEXT, -- JSON of previous state
  new_value TEXT, -- JSON of new state
  ip_address TEXT,
  user_agent TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Create indexes for audit log
CREATE INDEX IF NOT EXISTS role_audit_tenant_idx ON role_audit_log(tenant_id);
CREATE INDEX IF NOT EXISTS role_audit_user_idx ON role_audit_log(user_id);
CREATE INDEX IF NOT EXISTS role_audit_action_idx ON role_audit_log(action);
CREATE INDEX IF NOT EXISTS role_audit_resource_idx ON role_audit_log(resource_type, resource_id);

-- ========================================
-- DEFAULT ROLE TEMPLATES FOR EXISTING TENANTS
-- ========================================

-- Insert default roles for each existing tenant
INSERT OR IGNORE INTO roles (tenant_id, name, description, permissions, is_system_role, is_active)
SELECT
  t.id as tenant_id,
  'Administrator' as name,
  'Full system access and management' as description,
  '["*","user:manage_roles","tenant:manage","billing:manage","settings:update","system_admin"]' as permissions,
  1 as is_system_role,
  1 as is_active
FROM tenants t;

INSERT OR IGNORE INTO roles (tenant_id, name, description, permissions, is_system_role, is_active)
SELECT
  t.id as tenant_id,
  'Staff' as name,
  'Operational staff with booking and client management' as description,
  '["appointment:create","appointment:read","appointment:update","appointment:delete","user:read","service:read","product:read","dashboard:view","notifications:manage"]' as permissions,
  1 as is_system_role,
  1 as is_active
FROM tenants t;

INSERT OR IGNORE INTO roles (tenant_id, name, description, permissions, is_system_role, is_active)
SELECT
  t.id as tenant_id,
  'Customer' as name,
  'Registered customers with booking access' as description,
  '["appointment:create","appointment:read","appointment:update","product:read"]' as permissions,
  1 as is_system_role,
  1 as is_active
FROM tenants t;

INSERT OR IGNORE INTO roles (tenant_id, name, description, permissions, is_system_role, is_active)
SELECT
  t.id as tenant_id,
  'Guest' as name,
  'Anonymous users for booking' as description,
  '["appointment:create","service:read","product:read"]' as permissions,
  1 as is_system_role,
  1 as is_active
FROM tenants t;

-- Assign Admin role to existing users (fallback: assign to first user in each tenant)
INSERT OR IGNORE INTO user_roles (user_id, role_id, assigned_by, is_active)
SELECT
  u.id as user_id,
  r.id as role_id,
  u.id as assigned_by, -- Self-assigned for migration
  1 as is_active
FROM users u
JOIN roles r ON r.tenant_id = u.tenant_id AND r.name = 'Administrator'
WHERE u.id = (SELECT MIN(id) FROM users WHERE tenant_id = u.tenant_id); -- Assign to first user as admin

-- Assign Staff role to all remaining users
INSERT OR IGNORE INTO user_roles (user_id, role_id, assigned_by, is_active)
SELECT
  u.id as user_id,
  r.id as role_id,
  (SELECT id FROM users WHERE tenant_id = u.tenant_id LIMIT 1) as assigned_by,
  1 as is_active
FROM users u
JOIN roles r ON r.tenant_id = u.tenant_id AND r.name = 'Staff'
WHERE u.id NOT IN (SELECT user_id FROM user_roles);

-- ========================================
-- ADVANCED AVAILABILITY MANAGEMENT
-- ========================================

-- Employee schedules table
CREATE TABLE IF NOT EXISTS employee_schedules (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  employee_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 6 = Saturday
  start_time TEXT NOT NULL, -- HH:MM format
  end_time TEXT NOT NULL, -- HH:MM format
  break_start TEXT, -- Optional break period start
  break_end TEXT, -- Optional break period end
  is_active INTEGER DEFAULT 1, -- BOOLEAN
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS employee_schedules_employee_idx ON employee_schedules(employee_id);
CREATE INDEX IF NOT EXISTS employee_schedules_day_idx ON employee_schedules(day_of_week);

-- Holidays table
CREATE TABLE IF NOT EXISTS holidays (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL, -- YYYY-MM-DD format
  is_recurring INTEGER DEFAULT 0, -- BOOLEAN
  affects_all_employees INTEGER DEFAULT 1, -- BOOLEAN
  affected_employee_ids TEXT, -- JSON array of employee IDs
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS holidays_tenant_idx ON holidays(tenant_id);
CREATE INDEX IF NOT EXISTS holidays_date_idx ON holidays(date);

-- Blocked time slots table
CREATE TABLE IF NOT EXISTS blocked_slots (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_id TEXT REFERENCES employees(id) ON DELETE CASCADE, -- NULL = all employees
  start_time INTEGER NOT NULL, -- Unix timestamp
  end_time INTEGER NOT NULL, -- Unix timestamp
  reason TEXT NOT NULL,
  is_active INTEGER DEFAULT 1, -- BOOLEAN
  created_by TEXT REFERENCES users(id),
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS blocked_slots_tenant_idx ON blocked_slots(tenant_id);
CREATE INDEX IF NOT EXISTS blocked_slots_employee_idx ON blocked_slots(employee_id);
CREATE INDEX IF NOT EXISTS blocked_slots_time_idx ON blocked_slots(start_time, end_time);

-- ========================================
-- PAYMENT PLANS & DEPOSITS
-- ========================================

-- Payment plans table
CREATE TABLE IF NOT EXISTS payment_plans (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  booking_id TEXT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  total_amount INTEGER NOT NULL, -- Total booking amount in cents
  deposit_amount INTEGER, -- Required deposit in cents (NULL = full payment)
  deposit_percentage INTEGER, -- Alternative to fixed amount (e.g., 50 for 50%)
  payment_schedule TEXT, -- JSON array of payment dates and amounts
  status TEXT DEFAULT 'pending', -- 'pending', 'deposit_paid', 'completed', 'cancelled'
  auto_charge_enabled INTEGER DEFAULT 0, -- BOOLEAN
  reminder_settings TEXT, -- JSON with reminder preferences
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS payment_plans_booking_idx ON payment_plans(booking_id);
CREATE INDEX IF NOT EXISTS payment_plans_tenant_idx ON payment_plans(tenant_id);
CREATE INDEX IF NOT EXISTS payment_plans_status_idx ON payment_plans(status);

-- Payment installments table
CREATE TABLE IF NOT EXISTS payment_installments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  payment_plan_id TEXT NOT NULL REFERENCES payment_plans(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Amount in cents
  due_date INTEGER NOT NULL, -- Unix timestamp
  paid_date INTEGER, -- Unix timestamp when paid
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'cancelled'
  payment_method TEXT,
  transaction_id TEXT,
  failure_reason TEXT,
  reminder_sent INTEGER DEFAULT 0, -- BOOLEAN
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS payment_installments_plan_idx ON payment_installments(payment_plan_id);
CREATE INDEX IF NOT EXISTS payment_installments_due_idx ON payment_installments(due_date);
CREATE INDEX IF NOT EXISTS payment_installments_status_idx ON payment_installments(status);

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

-- ========================================
-- POST-MIGRATION NOTES
-- ========================================
-- 1. Update authentication middleware to use new RBAC system
-- 2. Update API endpoints to check permissions instead of simple user roles
-- 3. Update dashboard to show role-based features
-- 4. Create UI for role management
-- 5. Test all permission combinations
-- 6. Update API documentation with permission requirements

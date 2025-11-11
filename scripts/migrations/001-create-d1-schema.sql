-- D1 Migration: Create tables for appointment booking system
-- SQLite compatible schema

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  slug TEXT NOT NULL UNIQUE,
  name TEXT,
  hostnames TEXT, -- JSON array as text
  config TEXT DEFAULT '{}', -- JSON as text
  salon_id TEXT,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in cents
  duration_minutes INTEGER NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  service_id TEXT NOT NULL,
  scheduled_time INTEGER NOT NULL, -- Unix timestamp
  status TEXT DEFAULT 'pending',
  notes TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_reference TEXT,
  supersaas_booking_id TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id ON appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_time ON appointments(scheduled_time);

-- Insert Instyle Hair Boutique tenant
INSERT OR IGNORE INTO tenants (
  id,
  slug, 
  name, 
  hostnames, 
  config, 
  salon_id
) VALUES (
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'instylehairboutique',
  'InStyle Hair Boutique',
  '["instylehairboutique.co.za","www.instylehairboutique.co.za"]',
  '{"branding":{"logo_url":"/tenants/instyle/logo.png","primary_color":"#8B4513","secondary_color":"#D2691E"},"business_hours":{"monday":"09:00-17:00","tuesday":"09:00-17:00","wednesday":"09:00-17:00","thursday":"09:00-17:00","friday":"09:00-17:00","saturday":"08:00-16:00","sunday":"closed"},"contact":{"phone":"+27123456789","email":"bookings@instylehairboutique.co.za","address":"123 Hair Street, Cape Town, South Africa"}}',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
);

-- Insert services for Instyle Hair Boutique
INSERT OR IGNORE INTO services (tenant_id, name, description, price, duration_minutes) VALUES
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Middle & Side Installation', 'Professional hair installation service for middle and side parts', 45000, 180),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maphondo & Lines', 'Traditional African hairstyling with intricate patterns', 35000, 120),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Treatment', 'Deep conditioning and nourishing hair treatment', 25000, 90),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Coloring', 'Professional hair coloring and highlighting services', 55000, 150),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Extensions', 'Premium hair extension installation and styling', 65000, 240),
('ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Wash & Style', 'Complete hair wash, conditioning, and styling service', 15000, 60);
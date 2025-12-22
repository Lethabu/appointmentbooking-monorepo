-- Migration: Add payment configuration to tenants table
ALTER TABLE tenants ADD COLUMN currency TEXT DEFAULT 'ZAR';
ALTER TABLE tenants ADD COLUMN payment_config TEXT; -- JSON column

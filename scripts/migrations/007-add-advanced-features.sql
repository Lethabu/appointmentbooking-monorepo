-- Migration: Add Advanced Features Tables
-- Description: Adds WhatsApp and marketing tables (ecommerce tables already exist)
-- Date: 2025-12-11

-- WhatsApp integration tables
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  phone_number TEXT NOT NULL,
  message_type TEXT NOT NULL, -- 'incoming', 'outgoing'
  content TEXT NOT NULL,
  message_id TEXT, -- WhatsApp message ID
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'failed'
  appointment_id TEXT, -- Link to booking
  created_at INTEGER DEFAULT (unixepoch())
);

-- Indexes for WhatsApp messages
CREATE INDEX IF NOT EXISTS whatsapp_messages_tenant_idx ON whatsapp_messages(tenant_id);
CREATE INDEX IF NOT EXISTS whatsapp_messages_phone_idx ON whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS whatsapp_messages_appointment_idx ON whatsapp_messages(appointment_id);

-- Automated campaigns for marketing
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'reminder', 'promotion', 'followup'
  message_template TEXT NOT NULL,
  target_audience TEXT, -- 'all', 'new_clients', 'returning'
  schedule_type TEXT, -- 'immediate', 'scheduled', 'recurring'
  is_active INTEGER DEFAULT 1, -- boolean
  created_at INTEGER DEFAULT (unixepoch())
);

-- Indexes for marketing campaigns
CREATE INDEX IF NOT EXISTS marketing_campaigns_tenant_idx ON marketing_campaigns(tenant_id);
CREATE INDEX IF NOT EXISTS marketing_campaigns_type_idx ON marketing_campaigns(type);

-- Insert sample marketing campaigns
INSERT OR IGNORE INTO marketing_campaigns (id, tenant_id, name, type, message_template, target_audience, schedule_type, is_active)
VALUES
  ('camp_001', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Appointment Reminder', 'reminder', 'Hi {name}! Your appointment is tomorrow at {time}. We can''t wait to see you! 💇‍♀️', 'all', 'scheduled', 1),
  ('camp_002', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Welcome Back', 'followup', 'Thank you for visiting InStyle! Ready to book your next appointment? 📅', 'returning', 'immediate', 1);

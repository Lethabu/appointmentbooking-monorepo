-- Migration: 002-instyle-hair-boutique-setup.sql
-- Purpose: Set up Instyle Hair Boutique tenant with initial data

-- Insert Instyle Hair Boutique tenant
INSERT INTO tenants (id, slug, name, hostnames, config, salon_id, is_active)
VALUES (
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'instylehairboutique',
  'InStyle Hair Boutique',
  ARRAY['instylehairboutique.co.za', 'www.instylehairboutique.co.za'],
  '{
    "branding": {
      "logo_url": "/tenants/instyle/logo.png",
      "primary_color": "#8B5CF6",
      "secondary_color": "#F59E0B"
    },
    "business_hours": {
      "monday": {"open": "09:00", "close": "18:00"},
      "tuesday": {"open": "09:00", "close": "18:00"},
      "wednesday": {"open": "09:00", "close": "18:00"},
      "thursday": {"open": "09:00", "close": "18:00"},
      "friday": {"open": "09:00", "close": "18:00"},
      "saturday": {"open": "08:00", "close": "16:00"},
      "sunday": {"open": null, "close": null}
    },
    "contact": {
      "phone": "+27-XX-XXX-XXXX",
      "email": "info@instylehairboutique.co.za",
      "address": "Cape Town, South Africa"
    }
  }'::jsonb,
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  hostnames = EXCLUDED.hostnames,
  config = EXCLUDED.config,
  salon_id = EXCLUDED.salon_id,
  is_active = EXCLUDED.is_active,
  updated_at = unixepoch();

-- Insert initial services for Instyle Hair Boutique
INSERT INTO services (id, tenant_id, name, duration_minutes, price, is_active) VALUES
  ('service_middle_side_installation', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Middle & Side Installation', 60, 45000, true),
  ('service_maphondo_lines_installation', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maphondo & Lines Installation', 90, 60000, true),
  ('service_hair_treatment', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Treatment', 30, 25000, true),
  ('service_haircut_styling', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Haircut & Styling', 45, 35000, true),
  ('service_hair_coloring', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Coloring', 120, 80000, true),
  ('service_hair_extensions', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hair Extensions', 180, 120000, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  duration_minutes = EXCLUDED.duration_minutes,
  price = EXCLUDED.price,
  is_active = EXCLUDED.is_active;

-- End of migration

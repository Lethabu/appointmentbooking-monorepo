-- Fix Instyle Branding Configuration
-- Updates the tenant configuration to use Crimson palette instead of Saddle Brown
-- This aligns the database config with the frontend component branding

UPDATE tenants 
SET 
  config = json_set(
    json_set(
      config, 
      '$.branding.primary_color', 
      '#C0392B'
    ),
    '$.branding.secondary_color', 
    '#1B1B1B'
  ),
  updated_at = unixepoch('now')
WHERE slug = 'instylehairboutique';

-- Verify the update
SELECT 
  slug,
  name,
  json_extract(config, '$.branding.primary_color') as primary_color,
  json_extract(config, '$.branding.secondary_color') as secondary_color,
  datetime(updated_at, 'unixepoch') as updated_at
FROM tenants 
WHERE slug = 'instylehairboutique';

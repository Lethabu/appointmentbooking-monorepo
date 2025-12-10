-- Update InStyle Hair Boutique logo URL in tenant configuration
UPDATE tenants 
SET config = json_set(
  config,
  '$.branding.logo_url', '/logos/instyle-logo.png'
)
WHERE slug = 'instylehairboutique';

-- Verify the update
SELECT 
  id,
  slug,
  name,
  json_extract(config, '$.branding.logo_url') as logo_url
FROM tenants 
WHERE slug = 'instylehairboutique';

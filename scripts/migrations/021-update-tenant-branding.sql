-- Update Instyle Hair Boutique branding and contact info
UPDATE tenants 
SET config = '{
  "branding": {
    "logo_url": "/tenants/instyle/logo.png",
    "primary_color": "#C0392B",
    "secondary_color": "#1B1B1B"
  },
  "business_hours": {
    "monday": "09:00-17:00",
    "tuesday": "09:00-17:00",
    "wednesday": "09:00-17:00",
    "thursday": "09:00-17:00",
    "friday": "09:00-17:00",
    "saturday": "08:00-16:00",
    "sunday": "closed"
  },
  "contact": {
    "phone": "+27699171527",
    "email": "info@instylehairboutique.co.za",
    "address": "Cape Town, South Africa"
  }
}'
WHERE slug = 'instylehairboutique';

-- Update InStyle Hair Boutique tenant configuration with complete contact details, socials, and Google Maps
-- This migration enhances the tenant config with real contact information and social media links

UPDATE tenants 
SET config = json_set(
  config,
  '$.contact.phone', '+27 69 917 1527',
  '$.contact.whatsapp', '+27699171527',
  '$.contact.email', 'info@instylehairboutique.co.za',
  '$.contact.address', 'Cape Town, South Africa',
  '$.contact.google_maps_url', 'https://maps.google.com/?q=InStyle+Hair+Boutique+Cape+Town',
  '$.contact.google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.2!2d18.4!3d-33.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU0JzAwLjAiUyAxOMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sza!4v1234567890',
  '$.socials.facebook', 'https://facebook.com/instylehairboutique',
  '$.socials.instagram', 'https://instagram.com/instylehairboutique',
  '$.socials.tiktok', 'https://tiktok.com/@instylehairboutique',
  '$.socials.whatsapp', 'https://wa.me/27699171527',
  '$.payment.booking_fee_percentage', 20,
  '$.payment.booking_fee_minimum', 5000,
  '$.payment.paystack_public_key', 'pk_test_placeholder',
  '$.features.whatsapp_confirmation', true,
  '$.features.email_confirmation', true,
  '$.features.sms_confirmation', false,
  '$.features.ecommerce_enabled', true,
  '$.urls.dashboard', 'https://dashboard.appointmentbooking.co.za/instylehairboutique',
  '$.urls.marketing', 'https://appointmentbooking.co.za',
  '$.urls.booking', 'https://www.instylehairboutique.co.za'
)
WHERE slug = 'instylehairboutique';

-- Verify the update
SELECT 
  id,
  slug,
  name,
  config
FROM tenants 
WHERE slug = 'instylehairboutique';

-- Migration: 001-create-tenants.sql
-- Purpose: Create the `tenants` table used by the booking app and supporting
-- scripts. Includes hostnames (text[]), a jsonb `config` column, slug, and
-- a UUID primary key. Also adds indexes and a trigger to update `updated_at`.

-- NOTE: Review the `salon_id` type and any legacy code that may reference
-- string slugs as tenant identifiers. This migration uses UUID primary keys
-- but keeps `slug` as a unique, not-null column for human-friendly lookup.

-- Require pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create table
CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text,
  hostnames text[] DEFAULT ARRAY[]::text[],
  config jsonb DEFAULT '{}'::jsonb,
  salon_id text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index to speed slug lookups
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants (slug);

-- GIN index for hostnames array and json config
CREATE INDEX IF NOT EXISTS idx_tenants_hostnames ON public.tenants USING gin (hostnames);
CREATE INDEX IF NOT EXISTS idx_tenants_config_gin ON public.tenants USING gin (config);

-- Trigger to automatically update `updated_at` timestamp on row changes
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON public.tenants;
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

-- Sample tenant insert (adjust hostnames, slug, ids to match your environment)
-- INSERT INTO public.tenants (slug, name, hostnames, config, salon_id)
-- VALUES (
--   'instylehairboutique',
--   'InStyle Hair Boutique',
--   ARRAY['instylehairboutique.co.za','www.instylehairboutique.co.za'],
--   '{"branding": {"logo_url": "/tenants/instyle/logo.png"}}'::jsonb,
--   'ccb12b4d-ade6-467d-a614-7c9d198ddc70'
-- );

-- End of migration

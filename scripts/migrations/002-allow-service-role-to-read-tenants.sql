-- Migration: 002-allow-service-role-to-read-tenants.sql
-- Purpose: Allow service_role to read all rows from the tenants table.

-- Enable Row Level Security if it's not already enabled.
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Drop any existing policy for service_role on tenants table.
DROP POLICY IF EXISTS "Allow service_role to read all tenants" ON public.tenants;

-- Create a new policy that allows service_role to read all tenants.
CREATE POLICY "Allow service_role to read all tenants"
ON public.tenants
FOR SELECT
TO service_role
USING (true);
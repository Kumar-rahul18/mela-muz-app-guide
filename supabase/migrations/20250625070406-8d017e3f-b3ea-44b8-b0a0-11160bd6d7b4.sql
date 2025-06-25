
-- Remove vehicle_number column from vehicle_registrations table
ALTER TABLE public.vehicle_registrations DROP COLUMN IF EXISTS vehicle_number;

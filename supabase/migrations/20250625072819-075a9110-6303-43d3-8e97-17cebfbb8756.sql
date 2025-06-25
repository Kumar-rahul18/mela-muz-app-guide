
-- Fix the generate_vehicle_id function to resolve ambiguous column reference
CREATE OR REPLACE FUNCTION public.generate_vehicle_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  vehicle_id TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate MUZ + 5 random digits
    vehicle_id := 'MUZ' || LPAD(FLOOR(RANDOM() * 99999 + 1)::TEXT, 5, '0');
    
    -- Check if this ID already exists (fixed ambiguous reference)
    SELECT EXISTS(SELECT 1 FROM public.vehicle_registrations WHERE public.vehicle_registrations.vehicle_id = vehicle_id) INTO exists_check;
    
    -- If it doesn't exist, we can use it
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN vehicle_id;
END;
$$;

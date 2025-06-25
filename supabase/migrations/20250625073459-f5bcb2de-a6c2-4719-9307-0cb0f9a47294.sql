
-- Update the generate_vehicle_id function to use 6 digits and ensure uniqueness
CREATE OR REPLACE FUNCTION public.generate_vehicle_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_vehicle_id TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate MUZ + 6 random digits (100000 to 999999)
    new_vehicle_id := 'MUZ' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
    
    -- Check if this ID already exists
    SELECT EXISTS(SELECT 1 FROM public.vehicle_registrations WHERE vehicle_id = new_vehicle_id) INTO exists_check;
    
    -- If it doesn't exist, we can use it
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_vehicle_id;
END;
$$;

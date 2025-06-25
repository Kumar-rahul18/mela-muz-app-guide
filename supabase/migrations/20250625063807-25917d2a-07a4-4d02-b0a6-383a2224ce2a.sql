
-- Create table for vehicle registrations
CREATE TABLE public.vehicle_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id TEXT NOT NULL UNIQUE,
  owner_name TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  vehicle_photo_url TEXT NOT NULL,
  parking_status TEXT NOT NULL DEFAULT 'parked',
  registered_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for unparking records
CREATE TABLE public.vehicle_unparking_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_registration_id UUID REFERENCES public.vehicle_registrations(id) ON DELETE CASCADE,
  unparker_phone TEXT NOT NULL,
  unparker_photo_url TEXT NOT NULL,
  unparked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unparked_by UUID REFERENCES auth.users(id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.vehicle_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_unparking_records ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicle_registrations
CREATE POLICY "Admins can view all vehicle registrations" 
  ON public.vehicle_registrations 
  FOR SELECT 
  USING (public.is_admin_user());

CREATE POLICY "Admins can insert vehicle registrations" 
  ON public.vehicle_registrations 
  FOR INSERT 
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update vehicle registrations" 
  ON public.vehicle_registrations 
  FOR UPDATE 
  USING (public.is_admin_user());

-- Create policies for vehicle_unparking_records
CREATE POLICY "Admins can view all unparking records" 
  ON public.vehicle_unparking_records 
  FOR SELECT 
  USING (public.is_admin_user());

CREATE POLICY "Admins can insert unparking records" 
  ON public.vehicle_unparking_records 
  FOR INSERT 
  WITH CHECK (public.is_admin_user());

-- Function to generate unique vehicle ID
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
    
    -- Check if this ID already exists
    SELECT EXISTS(SELECT 1 FROM public.vehicle_registrations WHERE vehicle_id = vehicle_id) INTO exists_check;
    
    -- If it doesn't exist, we can use it
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN vehicle_id;
END;
$$;

-- Create storage bucket for vehicle photos
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-photos', 'vehicle-photos', true);

-- Create storage policies
CREATE POLICY "Admins can upload vehicle photos" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'vehicle-photos' AND public.is_admin_user());

CREATE POLICY "Anyone can view vehicle photos" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'vehicle-photos');

CREATE POLICY "Admins can update vehicle photos" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'vehicle-photos' AND public.is_admin_user());

CREATE POLICY "Admins can delete vehicle photos" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'vehicle-photos' AND public.is_admin_user());

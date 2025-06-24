
-- Create table for lost and found items
CREATE TABLE public.lost_found_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Lost', 'Found')),
  images TEXT[] NOT NULL DEFAULT '{}',
  submitted_at TEXT,
  helpdesk_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (Row Level Security) but make it publicly readable
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read lost and found items
CREATE POLICY "Anyone can view lost and found items" 
  ON public.lost_found_items 
  FOR SELECT 
  TO public
  USING (true);

-- Create policy to allow anyone to insert lost and found items
CREATE POLICY "Anyone can create lost and found items" 
  ON public.lost_found_items 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Create storage bucket for lost and found images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lost-found-images', 'lost-found-images', true);

-- Create policy for storage bucket to allow public uploads and reads
CREATE POLICY "Anyone can upload lost and found images" 
ON storage.objects FOR INSERT 
TO public
WITH CHECK (bucket_id = 'lost-found-images');

CREATE POLICY "Anyone can view lost and found images" 
ON storage.objects FOR SELECT 
TO public
USING (bucket_id = 'lost-found-images');

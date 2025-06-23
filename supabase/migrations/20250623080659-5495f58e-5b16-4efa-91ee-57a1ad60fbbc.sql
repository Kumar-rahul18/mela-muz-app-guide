
-- Create a table to store photo contest submissions
CREATE TABLE public.photo_contest_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on photo contest submissions
ALTER TABLE public.photo_contest_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for public to insert submissions
CREATE POLICY "Anyone can submit photos" 
  ON public.photo_contest_submissions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for public to view approved submissions
CREATE POLICY "Anyone can view approved submissions" 
  ON public.photo_contest_submissions 
  FOR SELECT 
  USING (is_approved = true);

-- Create storage bucket for photo contest images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photo-contest', 'photo-contest', true);

-- Create storage policy for photo contest uploads
CREATE POLICY "Anyone can upload contest photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'photo-contest');

-- Create storage policy for viewing contest photos
CREATE POLICY "Anyone can view contest photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'photo-contest');

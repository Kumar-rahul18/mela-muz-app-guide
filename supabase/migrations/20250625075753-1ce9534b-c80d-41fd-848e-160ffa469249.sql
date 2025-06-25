
-- Create storage bucket for photo contest if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photo-contest', 'photo-contest', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure public viewing policy exists for photo contest images
CREATE POLICY "Anyone can view photo contest images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'photo-contest');

-- Allow public uploads to photo contest bucket
CREATE POLICY "Anyone can upload photo contest images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'photo-contest');

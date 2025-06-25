
-- Create storage bucket for vehicle photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-photos', 'vehicle-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure the public policy for viewing photos exists
CREATE POLICY "Anyone can view vehicle photos" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'vehicle-photos');

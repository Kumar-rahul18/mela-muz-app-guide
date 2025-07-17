
-- Check current policies on photo_contest_submissions
-- The table currently only allows INSERT and SELECT, but not UPDATE
-- We need to add a policy to allow UPDATE for vote_count

-- Add policy to allow anyone to update vote_count on photo submissions
CREATE POLICY "Anyone can update vote count on photo submissions" 
  ON public.photo_contest_submissions 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Also ensure the trigger function has proper permissions
-- Grant necessary permissions to the trigger function
GRANT UPDATE ON public.photo_contest_submissions TO anon;
GRANT UPDATE ON public.photo_contest_submissions TO authenticated;

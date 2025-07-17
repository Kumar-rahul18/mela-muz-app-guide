
-- Create a table to store photo votes
CREATE TABLE public.photo_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID NOT NULL REFERENCES public.photo_contest_submissions(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  vote_type TEXT NOT NULL DEFAULT 'like',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate votes from same user on same photo
ALTER TABLE public.photo_votes ADD CONSTRAINT unique_user_photo_vote UNIQUE (photo_id, user_identifier);

-- Add vote_count column to photo_contest_submissions table
ALTER TABLE public.photo_contest_submissions ADD COLUMN vote_count INTEGER DEFAULT 0;

-- Create index for better performance
CREATE INDEX idx_photo_votes_photo_id ON public.photo_votes(photo_id);
CREATE INDEX idx_photo_votes_user_identifier ON public.photo_votes(user_identifier);

-- Enable RLS on photo votes
ALTER TABLE public.photo_votes ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to insert votes
CREATE POLICY "Anyone can vote on photos" 
  ON public.photo_votes 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for anyone to view votes
CREATE POLICY "Anyone can view photo votes" 
  ON public.photo_votes 
  FOR SELECT 
  USING (true);

-- Create function to update vote count when votes are added/removed
CREATE OR REPLACE FUNCTION update_photo_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.photo_contest_submissions 
    SET vote_count = vote_count + 1 
    WHERE id = NEW.photo_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.photo_contest_submissions 
    SET vote_count = vote_count - 1 
    WHERE id = OLD.photo_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update vote counts
CREATE TRIGGER trigger_update_photo_vote_count
  AFTER INSERT OR DELETE ON public.photo_votes
  FOR EACH ROW EXECUTE FUNCTION update_photo_vote_count();

-- Update existing submissions to have correct vote counts
UPDATE public.photo_contest_submissions 
SET vote_count = (
  SELECT COUNT(*) 
  FROM public.photo_votes 
  WHERE photo_votes.photo_id = photo_contest_submissions.id
);


-- First, let's check if the trigger is working properly and fix the vote count update mechanism

-- Drop the existing trigger and function to recreate them properly
DROP TRIGGER IF EXISTS trigger_update_photo_vote_count ON public.photo_votes;
DROP FUNCTION IF EXISTS update_photo_vote_count();

-- Create a more robust function to update vote counts
CREATE OR REPLACE FUNCTION update_photo_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment vote count when a vote is added
    UPDATE public.photo_contest_submissions 
    SET vote_count = COALESCE(vote_count, 0) + 1 
    WHERE id = NEW.photo_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement vote count when a vote is removed
    UPDATE public.photo_contest_submissions 
    SET vote_count = GREATEST(COALESCE(vote_count, 0) - 1, 0)
    WHERE id = OLD.photo_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER trigger_update_photo_vote_count
  AFTER INSERT OR DELETE ON public.photo_votes
  FOR EACH ROW EXECUTE FUNCTION update_photo_vote_count();

-- Update all existing photo submissions to have correct vote counts
UPDATE public.photo_contest_submissions 
SET vote_count = (
  SELECT COUNT(*) 
  FROM public.photo_votes 
  WHERE photo_votes.photo_id = photo_contest_submissions.id
);

-- Ensure vote_count is never null by setting default to 0 for existing records
UPDATE public.photo_contest_submissions 
SET vote_count = 0 
WHERE vote_count IS NULL;

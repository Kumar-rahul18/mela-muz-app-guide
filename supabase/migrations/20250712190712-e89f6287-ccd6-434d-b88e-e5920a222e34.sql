
-- Add ranking column to contacts table
ALTER TABLE public.contacts 
ADD COLUMN ranking INTEGER NULL;

-- Add comment to clarify the ranking column purpose
COMMENT ON COLUMN public.contacts.ranking IS 'Ranking within each category (district_admin, mmc_admin). Lower numbers indicate higher priority.';

-- Create index for better performance when ordering by ranking
CREATE INDEX idx_contacts_category_ranking ON public.contacts(category, ranking NULLS LAST);


-- Add a category column to the contacts table to distinguish between different admin types
ALTER TABLE public.contacts ADD COLUMN category TEXT DEFAULT 'general';

-- Update the category column to use specific values
UPDATE public.contacts SET category = 'general' WHERE category IS NULL;

-- Add a check constraint to ensure only valid categories are used
ALTER TABLE public.contacts ADD CONSTRAINT contacts_category_check 
CHECK (category IN ('general', 'district_admin', 'mmc_admin'));

-- Create an index for better performance when filtering by category
CREATE INDEX idx_contacts_category ON public.contacts(category);

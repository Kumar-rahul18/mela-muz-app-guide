
-- Create feedback table to store user feedback with ratings
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  feedback TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit feedback
CREATE POLICY "Anyone can submit feedback" 
  ON public.feedback 
  FOR INSERT 
  WITH CHECK (true);

-- Allow admins to view all feedback
CREATE POLICY "Admins can view all feedback" 
  ON public.feedback 
  FOR SELECT 
  USING (true);

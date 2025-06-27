
-- Create quiz_attempts table to store quiz results
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate attempts from same phone
ALTER TABLE public.quiz_attempts 
ADD CONSTRAINT unique_phone_attempt UNIQUE (phone);

-- Enable RLS (though we'll make it public for this quiz feature)
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read quiz attempts (for leaderboard)
CREATE POLICY "Anyone can view quiz attempts" 
ON public.quiz_attempts 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert quiz attempts
CREATE POLICY "Anyone can create quiz attempts" 
ON public.quiz_attempts 
FOR INSERT 
WITH CHECK (true);

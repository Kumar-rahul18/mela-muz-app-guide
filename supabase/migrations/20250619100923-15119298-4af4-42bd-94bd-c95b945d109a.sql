
-- Create table for gallery images
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for crowd status
CREATE TABLE public.crowd_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('low', 'medium', 'high')),
  status_color TEXT NOT NULL CHECK (status_color IN ('green', 'yellow', 'red')),
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS policies for gallery_images (public read, admin write)
CREATE POLICY "Anyone can view active gallery images" 
  ON public.gallery_images 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage gallery images" 
  ON public.gallery_images 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- RLS policies for crowd_status (public read, admin write)
CREATE POLICY "Anyone can view crowd status" 
  ON public.crowd_status 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage crowd status" 
  ON public.crowd_status 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- RLS policies for admin_users (admins only)
CREATE POLICY "Admins can view admin users" 
  ON public.admin_users 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = true
    )
  );

-- Insert some sample data
INSERT INTO public.gallery_images (image_url, title, display_order) VALUES
('/placeholder.svg', 'Shravani Mela Scene 1', 1),
('/placeholder.svg', 'Devotees at Temple', 2),
('/placeholder.svg', 'Cultural Performance', 3),
('/placeholder.svg', 'Evening Aarti', 4),
('/placeholder.svg', 'Festival Lights', 5);

INSERT INTO public.crowd_status (location, status, status_color, description) VALUES
('Main Temple', 'medium', 'yellow', 'Moderate crowd expected'),
('Parking Area', 'low', 'green', 'Plenty of space available'),
('Food Court', 'high', 'red', 'Very crowded, expect delays');


-- First, let's fix the infinite recursion in admin_users policy
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create new admin_users policy without recursion
CREATE POLICY "Admins can view admin users" 
  ON public.admin_users 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Fix crowd_status policies to allow admin writes
DROP POLICY IF EXISTS "Admins can manage crowd status" ON public.crowd_status;
CREATE POLICY "Admins can manage crowd status" 
  ON public.crowd_status 
  FOR ALL 
  USING (public.is_admin_user());

-- Fix events policies to allow admin writes
CREATE POLICY "Admins can manage events" 
  ON public.events 
  FOR ALL 
  USING (public.is_admin_user());

-- Fix facilities policies to allow admin writes
CREATE POLICY "Admins can manage facilities" 
  ON public.facilities 
  FOR ALL 
  USING (public.is_admin_user());

-- Fix contacts policies to allow admin writes
CREATE POLICY "Admins can manage contacts" 
  ON public.contacts 
  FOR ALL 
  USING (public.is_admin_user());

-- Add public read policies for normal users
CREATE POLICY "Anyone can view active events" 
  ON public.events 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Anyone can view active facilities" 
  ON public.facilities 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Anyone can view active contacts" 
  ON public.contacts 
  FOR SELECT 
  USING (is_active = true);

-- Add is_admin column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create a function to make a user an admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  success BOOLEAN;
BEGIN
  UPDATE public.profiles
  SET is_admin = TRUE
  WHERE email = user_email;
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$;

-- Create a function to remove admin privileges
CREATE OR REPLACE FUNCTION public.remove_user_admin(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  success BOOLEAN;
BEGIN
  UPDATE public.profiles
  SET is_admin = FALSE
  WHERE email = user_email;
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$;

-- Grant admin privileges to the first user for initial setup
-- This is just for demonstration - in a real app, you'd want to be more selective
UPDATE public.profiles
SET is_admin = TRUE
WHERE id IN (
  SELECT id FROM public.profiles
  ORDER BY created_at
  LIMIT 1
);

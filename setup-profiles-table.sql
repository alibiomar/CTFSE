-- Create profiles table with all required fields
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  facebook_url TEXT,
  university TEXT,
  ctf_experience BOOLEAN DEFAULT FALSE,
  team_preference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for users to view and edit their own profiles
DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile" 
      ON public.profiles 
      FOR SELECT USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile" 
      ON public.profiles 
      FOR UPDATE USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile" 
      ON public.profiles 
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  
  -- Add policy for admins to view all profiles (you can customize this as needed)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles" 
      ON public.profiles 
      FOR SELECT USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
      ));
  END IF;
END
$;

-- Create a public function to check if an email is already registered
CREATE OR REPLACE FUNCTION public.check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE email = email_to_check
  ) INTO email_exists;
  
  RETURN email_exists;
END;
$$;

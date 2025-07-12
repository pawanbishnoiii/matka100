
-- Drop all existing policies on profiles table that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (id = auth.uid());

-- Allow service role full access without recursion
CREATE POLICY "Service role full access" ON public.profiles
  FOR ALL
  USING (current_setting('role') = 'service_role');

-- Fix users table policies to avoid recursion
DROP POLICY IF EXISTS "Enable admin access" ON public.users;
CREATE POLICY "Enable admin access" ON public.users
  FOR ALL
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true) THEN true
      ELSE false
    END
  );

-- Ensure the handle_new_user function works properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (
    id,
    email,
    name,
    referral_code,
    balance_inr,
    balance_gbp,
    status,
    kyc_status,
    is_admin,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'MTK' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)),
    0.00,
    0.00,
    'active',
    'pending',
    CASE WHEN NEW.email = 'bnoy.studios@gmail.com' THEN true ELSE false END,
    NOW(),
    NOW()
  );

  -- Insert into profiles table
  INSERT INTO public.profiles (
    id,
    email,
    is_admin,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN NEW.email = 'bnoy.studios@gmail.com' THEN true ELSE false END,
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

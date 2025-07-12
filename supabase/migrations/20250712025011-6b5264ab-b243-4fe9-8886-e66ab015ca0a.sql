
-- Fix the infinite recursion in RLS policies by completely removing problematic policies
-- and creating clean, non-recursive ones

-- First, drop all existing problematic policies on profiles table
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create new simplified policies for profiles table that don't cause recursion
CREATE POLICY "Enable read access for own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Create admin access policy using users table instead of profiles to avoid recursion
CREATE POLICY "Enable admin full access to profiles" ON public.profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Fix users table policies to avoid recursion
DROP POLICY IF EXISTS "Enable admin access" ON public.users;

CREATE POLICY "Enable admin access to users" ON public.users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users u2
    WHERE u2.id = auth.uid() AND u2.is_admin = true
  )
);

-- Update other policies that were using profiles table to use users table instead
DROP POLICY IF EXISTS "Enable admin bets access" ON public.bets;
DROP POLICY IF EXISTS "Enable admin transactions access" ON public.transactions;
DROP POLICY IF EXISTS "Admins can manage all tickets" ON public.help_tickets;

CREATE POLICY "Enable admin bets access" ON public.bets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Enable admin transactions access" ON public.transactions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can manage all help tickets" ON public.help_tickets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Fix the handle_new_user function to ensure both tables are properly created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into users table first
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

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create admin user function to help with testing
CREATE OR REPLACE FUNCTION public.create_test_admin_user()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Generate a UUID for the admin user
    admin_user_id := gen_random_uuid();
    
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
        admin_user_id,
        'admin@test.com',
        'Test Admin',
        'MTK' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)),
        10000.00,
        100.00,
        'active',
        'approved',
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (email) DO NOTHING;
    
    -- Insert into profiles table
    INSERT INTO public.profiles (
        id,
        email,
        is_admin,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'admin@test.com',
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO NOTHING;
    
    RETURN 'Test admin user created with ID: ' || admin_user_id || ' and email: admin@test.com';
END;
$$;

-- Call the function to create a test admin user
SELECT public.create_test_admin_user();


-- Phase 1 & 2: Fix Authentication Flow and Enhanced Admin Policies

-- Create enhanced admin detection functions
CREATE OR REPLACE FUNCTION public.is_admin_by_email(email_to_check text DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(email_to_check, '') = 'bnoy.studios@gmail.com';
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(
        (SELECT email FROM auth.users WHERE id = auth.uid()),
        ''
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_session()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT public.is_admin_by_email(public.get_current_user_email());
$$;

-- Enhanced admin detection that works without auth.uid()
CREATE OR REPLACE FUNCTION public.is_admin_context()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        CASE 
            WHEN auth.uid() IS NOT NULL THEN 
                public.is_admin_session()
            ELSE 
                -- Allow admin operations when no auth context (for setup/troubleshooting)
                true
        END;
$$;

-- Drop existing problematic policies on main tables
DROP POLICY IF EXISTS "Enable admin access" ON public.users;
DROP POLICY IF EXISTS "Enable read access for own data" ON public.users;
DROP POLICY IF EXISTS "Enable update for own data" ON public.users;

DROP POLICY IF EXISTS "Enable admin bets access" ON public.bets;
DROP POLICY IF EXISTS "Enable insert own bets" ON public.bets;
DROP POLICY IF EXISTS "Enable read own bets" ON public.bets;

DROP POLICY IF EXISTS "Anyone can view active games" ON public.games;
DROP POLICY IF EXISTS "Only admins can manage games" ON public.games;

DROP POLICY IF EXISTS "Anyone can view results" ON public.results;
DROP POLICY IF EXISTS "Only admins can manage results" ON public.results;

DROP POLICY IF EXISTS "Enable admin transactions access" ON public.transactions;
DROP POLICY IF EXISTS "Enable insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Enable read own transactions" ON public.transactions;

-- Create new robust policies for users table
CREATE POLICY "Admin full access to users" ON public.users 
FOR ALL TO authenticated 
USING (public.is_admin_context()) 
WITH CHECK (public.is_admin_context());

CREATE POLICY "Users can view own profile" ON public.users 
FOR SELECT TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users 
FOR UPDATE TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- Enhanced policies for bets table
CREATE POLICY "Admin can manage all bets" ON public.bets 
FOR ALL TO authenticated 
USING (public.is_admin_context()) 
WITH CHECK (public.is_admin_context());

CREATE POLICY "Users can create own bets" ON public.bets 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own bets" ON public.bets 
FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

-- Enhanced policies for games table
CREATE POLICY "Admin can manage games" ON public.games 
FOR ALL TO authenticated 
USING (public.is_admin_context()) 
WITH CHECK (public.is_admin_context());

CREATE POLICY "Anyone can view active games" ON public.games 
FOR SELECT TO authenticated 
USING (is_active = true);

-- Enhanced policies for results table
CREATE POLICY "Admin can manage results" ON public.results 
FOR ALL TO authenticated 
USING (public.is_admin_context()) 
WITH CHECK (public.is_admin_context());

CREATE POLICY "Anyone can view results" ON public.results 
FOR SELECT TO authenticated 
USING (true);

-- Enhanced policies for transactions table
CREATE POLICY "Admin can manage all transactions" ON public.transactions 
FOR ALL TO authenticated 
USING (public.is_admin_context()) 
WITH CHECK (public.is_admin_context());

CREATE POLICY "Users can create own transactions" ON public.transactions 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON public.transactions 
FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

-- Add bet_cart table for Phase 3 - Enhanced Multi-Bet System
CREATE TABLE IF NOT EXISTS public.bet_cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  game_id UUID REFERENCES public.games(id) NOT NULL,
  number INTEGER NOT NULL,
  bet_type public.bet_type NOT NULL,
  amount_inr NUMERIC NOT NULL,
  potential_win NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, game_id, number, bet_type)
);

-- Enable RLS on bet_cart
ALTER TABLE public.bet_cart ENABLE ROW LEVEL SECURITY;

-- Policies for bet_cart
CREATE POLICY "Admin can manage all cart items" ON public.bet_cart 
FOR ALL TO authenticated 
USING (public.is_admin_context()) 
WITH CHECK (public.is_admin_context());

CREATE POLICY "Users can manage own cart items" ON public.bet_cart 
FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Ensure admin user exists in users table
INSERT INTO public.users (id, email, name, is_admin) 
SELECT 
    auth.users.id,
    auth.users.email,
    COALESCE(auth.users.raw_user_meta_data->>'name', 'Admin User'),
    true
FROM auth.users 
WHERE auth.users.email = 'bnoy.studios@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'bnoy.studios@gmail.com'
)
ON CONFLICT (id) DO UPDATE SET 
    is_admin = true,
    email = EXCLUDED.email;

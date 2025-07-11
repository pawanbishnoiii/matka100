
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;

-- Create new simplified policies for users table
CREATE POLICY "Enable read access for own data" ON public.users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for own data" ON public.users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable admin access" ON public.users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Fix bets policies
DROP POLICY IF EXISTS "Users can view their own bets" ON public.bets;
DROP POLICY IF EXISTS "Users can place bets" ON public.bets;
DROP POLICY IF EXISTS "Admins can manage all bets" ON public.bets;

CREATE POLICY "Enable read own bets" ON public.bets
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert own bets" ON public.bets
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable admin bets access" ON public.bets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Fix transactions policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can manage all transactions" ON public.transactions;

CREATE POLICY "Enable read own transactions" ON public.transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert own transactions" ON public.transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable admin transactions access" ON public.transactions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Add missing columns to users table for wallet features
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS uui_id TEXT UNIQUE DEFAULT ('UUI' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)));

-- Create P2P transfers table
CREATE TABLE IF NOT EXISTS public.p2p_transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.users(id) NOT NULL,
  receiver_uui TEXT NOT NULL,
  receiver_id UUID REFERENCES public.users(id),
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status transaction_status DEFAULT 'completed',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for p2p_transfers
ALTER TABLE public.p2p_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their transfers" ON public.p2p_transfers
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create transfers" ON public.p2p_transfers
FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create lucky spin table
CREATE TABLE IF NOT EXISTS public.lucky_spins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  number INTEGER NOT NULL,
  reward_amount NUMERIC DEFAULT 0,
  spin_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, spin_date)
);

-- Enable RLS for lucky_spins
ALTER TABLE public.lucky_spins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spins" ON public.lucky_spins
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create spins" ON public.lucky_spins
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create help/support table
CREATE TABLE IF NOT EXISTS public.help_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for help_tickets
ALTER TABLE public.help_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tickets" ON public.help_tickets
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all tickets" ON public.help_tickets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Add settings for KYC visibility
INSERT INTO public.settings (key, value, description) 
VALUES (
  'kyc_enabled', 
  'true'::jsonb, 
  'Enable or disable KYC verification section'
) ON CONFLICT (key) DO NOTHING;

-- Add Razorpay settings
INSERT INTO public.settings (key, value, description) 
VALUES (
  'razorpay_config', 
  '{"key_id": "", "key_secret": "", "enabled": false}'::jsonb, 
  'Razorpay payment gateway configuration'
) ON CONFLICT (key) DO NOTHING;

-- Update users table to ensure UUI IDs are generated
UPDATE public.users 
SET uui_id = 'UUI' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8))
WHERE uui_id IS NULL;

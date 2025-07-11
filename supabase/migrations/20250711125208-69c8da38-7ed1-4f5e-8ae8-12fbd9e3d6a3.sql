
-- Fix foreign key constraints and create proper admin user setup
-- First, let's fix the users table constraints and add proper admin setup

-- Update users table to ensure proper constraints
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_referred_by_fkey;
ALTER TABLE public.users ADD CONSTRAINT users_referred_by_fkey 
  FOREIGN KEY (referred_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- Create unique constraint on referral_code if not exists
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_referral_code_key;
ALTER TABLE public.users ADD CONSTRAINT users_referral_code_key UNIQUE (referral_code);

-- Create unique constraint on email if not exists
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE public.users ADD CONSTRAINT users_email_key UNIQUE (email);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin);
CREATE INDEX IF NOT EXISTS idx_bets_user_game ON public.bets(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_status ON public.transactions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_results_game_date ON public.results(game_id, result_date);

-- Create admin auth function for restricted access
CREATE OR REPLACE FUNCTION public.is_admin_email(email_input text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT email_input = 'bnoy.studios@gmail.com';
$$;

-- Update RLS policies for admin access restriction
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
CREATE POLICY "Admins can manage all users" ON public.users
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'bnoy.studios@gmail.com' 
      AND is_admin = true
    )
  );

-- Update other admin policies to be more restrictive
DROP POLICY IF EXISTS "Admins can manage all bets" ON public.bets;
CREATE POLICY "Admins can manage all bets" ON public.bets
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'bnoy.studios@gmail.com' 
      AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Only admins can manage games" ON public.games;
CREATE POLICY "Only admins can manage games" ON public.games
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'bnoy.studios@gmail.com' 
      AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage all transactions" ON public.transactions;
CREATE POLICY "Admins can manage all transactions" ON public.transactions
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'bnoy.studios@gmail.com' 
      AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Only admins can manage results" ON public.results;
CREATE POLICY "Only admins can manage results" ON public.results
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'bnoy.studios@gmail.com' 
      AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Only admins can manage settings" ON public.settings;
CREATE POLICY "Only admins can manage settings" ON public.settings
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'bnoy.studios@gmail.com' 
      AND is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage referrals" ON public.referrals;
CREATE POLICY "Admins can manage referrals" ON public.referrals
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'bnoy.studios@gmail.com' 
      AND is_admin = true
    )
  );

-- Fix the handle_new_user function to properly create admin user
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'bnoy.studios@gmail.com' THEN
    INSERT INTO public.users (id, email, referral_code, is_admin, name, status, kyc_status)
    VALUES (
      NEW.id,
      NEW.email,
      generate_referral_code(),
      true,
      'Admin',
      'active',
      'approved'
    );
  ELSE
    INSERT INTO public.users (id, email, referral_code, is_admin, name, status)
    VALUES (
      NEW.id,
      NEW.email,
      generate_referral_code(),
      false,
      COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name', 'User'),
      'active'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add payment gateway settings table for admin control
CREATE TABLE IF NOT EXISTS public.payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  api_key TEXT,
  api_secret TEXT,
  webhook_secret TEXT,
  is_active BOOLEAN DEFAULT false,
  commission_rate DECIMAL(5,4) DEFAULT 0.0200,
  min_amount DECIMAL(10,2) DEFAULT 100.00,
  max_amount DECIMAL(10,2) DEFAULT 100000.00,
  supported_currencies TEXT[] DEFAULT ARRAY['INR'],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage payment gateways" ON public.payment_gateways
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'bnoy.studios@gmail.com' 
      AND is_admin = true
    )
  );

-- Insert default payment gateways
INSERT INTO public.payment_gateways (name, is_active, commission_rate, min_amount, max_amount, supported_currencies)
VALUES 
  ('razorpay', true, 0.0200, 100.00, 100000.00, ARRAY['INR']),
  ('upi', true, 0.0100, 10.00, 50000.00, ARRAY['INR']),
  ('bank_transfer', true, 0.0500, 500.00, 500000.00, ARRAY['INR']),
  ('usdt_trc20', false, 0.0100, 10.00, 100000.00, ARRAY['USDT'])
ON CONFLICT (name) DO NOTHING;

-- Add user profile image and additional fields
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address JSONB;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- Add betting preferences and limits
CREATE TABLE IF NOT EXISTS public.user_betting_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  favorite_numbers INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  quick_bet_amounts DECIMAL(10,2)[] DEFAULT ARRAY[10.00, 50.00, 100.00, 500.00],
  daily_bet_limit DECIMAL(10,2) DEFAULT 10000.00,
  auto_bet_enabled BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_betting_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their betting preferences" ON public.user_betting_preferences
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add loyalty and rewards system
CREATE TABLE IF NOT EXISTS public.user_loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'Bronze',
  total_bet_amount DECIMAL(15,2) DEFAULT 0.00,
  total_win_amount DECIMAL(15,2) DEFAULT 0.00,
  referral_count INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_loyalty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their loyalty info" ON public.user_loyalty
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can update loyalty info" ON public.user_loyalty
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update loyalty info update" ON public.user_loyalty
  FOR UPDATE USING (true);

-- Add audit log table for security
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND email = 'bnoy.studios@gmail.com' 
      AND is_admin = true
    )
  );

-- Add comprehensive game configuration
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS min_bet_amount DECIMAL(10,2) DEFAULT 10.00;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS max_bet_amount DECIMAL(10,2) DEFAULT 10000.00;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS bet_close_time TIME;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS rules JSONB;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS payout_schedule JSONB;

-- Update games with proper bet close times
UPDATE public.games SET bet_close_time = opening_time - INTERVAL '5 minutes' WHERE bet_close_time IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON public.audit_logs(user_id, action);
CREATE INDEX IF NOT EXISTS idx_user_loyalty_tier ON public.user_loyalty(loyalty_tier);
CREATE INDEX IF NOT EXISTS idx_payment_gateways_active ON public.payment_gateways(is_active);

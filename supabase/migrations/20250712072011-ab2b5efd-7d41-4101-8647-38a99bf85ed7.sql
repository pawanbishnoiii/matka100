
-- First, let's update the games table to support all 9 game types with proper timing and multiplier settings
INSERT INTO public.games (name, opening_time, closing_time, result_time, multipliers, is_active, status) VALUES
('Desawar', '05:00:00', NULL, '05:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}', true, 'active'),
('Gali', '23:45:00', NULL, '23:45:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}', true, 'active'),
('Faridabad', '18:15:00', '20:00:00', '20:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}', true, 'active'),
('Ghaziabad', '20:00:00', '22:00:00', '22:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}', true, 'active'),
('Kalyan', '16:15:00', '18:15:00', '18:15:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}', true, 'active'),
('Milan Day', '13:00:00', '15:00:00', '15:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}', true, 'active'),
('Milan Night', '21:00:00', '23:00:00', '23:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}', true, 'active'),
('Rajdhani Day', '13:00:00', '15:00:00', '15:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}', true, 'active'),
('Rajdhani Night', '21:00:00', '23:55:00', '23:55:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}', true, 'active')
ON CONFLICT (name) DO NOTHING;

-- Add betting cutoff timing (5 minutes before result)
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS betting_cutoff_minutes INTEGER DEFAULT 5;

-- Add commission settings
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS commission_percentage NUMERIC DEFAULT 10.00;

-- Update existing games table structure for better game management
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS game_type TEXT DEFAULT 'single_result';
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS min_bet_amount NUMERIC DEFAULT 10.00;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS max_bet_amount NUMERIC DEFAULT 10000.00;

-- Update specific games with their types
UPDATE public.games SET 
  game_type = 'single_result',
  description = 'Most famous game from Delhi; only open result'
WHERE name = 'Desawar';

UPDATE public.games SET 
  game_type = 'single_result',
  description = 'Very popular, also open-only result'
WHERE name = 'Gali';

UPDATE public.games SET 
  game_type = 'open_close',
  description = 'Includes Open + Close'
WHERE name IN ('Faridabad', 'Ghaziabad', 'Kalyan', 'Milan Day', 'Milan Night', 'Rajdhani Day', 'Rajdhani Night');

-- Create user statistics table for overview data
CREATE TABLE IF NOT EXISTS public.user_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  total_bets INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_amount_bet NUMERIC DEFAULT 0.00,
  total_amount_won NUMERIC DEFAULT 0.00,
  win_percentage NUMERIC DEFAULT 0.00,
  favorite_game TEXT,
  last_bet_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_statistics
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_statistics
CREATE POLICY "Users can view own statistics" ON public.user_statistics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all statistics" ON public.user_statistics
  FOR ALL USING (is_admin_context());

-- Create function to update user statistics
CREATE OR REPLACE FUNCTION public.update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update user statistics
  INSERT INTO public.user_statistics (
    user_id, 
    total_bets, 
    total_wins, 
    total_amount_bet, 
    total_amount_won,
    win_percentage,
    last_bet_date,
    updated_at
  ) 
  SELECT 
    NEW.user_id,
    COUNT(*) as total_bets,
    COUNT(*) FILTER (WHERE is_winner = true) as total_wins,
    SUM(amount_inr) as total_amount_bet,
    SUM(CASE WHEN is_winner = true THEN actual_win ELSE 0 END) as total_amount_won,
    CASE 
      WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE is_winner = true) * 100.0 / COUNT(*))
      ELSE 0 
    END as win_percentage,
    MAX(bet_date) as last_bet_date,
    now() as updated_at
  FROM public.bets 
  WHERE user_id = NEW.user_id
  ON CONFLICT (user_id) DO UPDATE SET
    total_bets = EXCLUDED.total_bets,
    total_wins = EXCLUDED.total_wins,
    total_amount_bet = EXCLUDED.total_amount_bet,
    total_amount_won = EXCLUDED.total_amount_won,
    win_percentage = EXCLUDED.win_percentage,
    last_bet_date = EXCLUDED.last_bet_date,
    updated_at = EXCLUDED.updated_at;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update statistics when bets are updated
CREATE OR REPLACE TRIGGER update_user_statistics_trigger
  AFTER INSERT OR UPDATE ON public.bets
  FOR EACH ROW EXECUTE FUNCTION public.update_user_statistics();

-- Create referral bonuses table for referral system
CREATE TABLE IF NOT EXISTS public.referral_bonuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  referee_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  bonus_type TEXT NOT NULL DEFAULT 'signup',
  bonus_amount NUMERIC NOT NULL DEFAULT 0.00,
  status TEXT DEFAULT 'pending',
  awarded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(referrer_id, referee_id, bonus_type)
);

-- Enable RLS on referral_bonuses
ALTER TABLE public.referral_bonuses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for referral_bonuses
CREATE POLICY "Users can view own referral bonuses" ON public.referral_bonuses
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

CREATE POLICY "Admin can manage all referral bonuses" ON public.referral_bonuses
  FOR ALL USING (is_admin_context());

-- Add referral settings to settings table
INSERT INTO public.settings (key, value, description) VALUES
('referral_signup_bonus', '50', 'Bonus amount for successful referral signup'),
('referral_commission_percentage', '5', 'Commission percentage for referrer on referee bets'),
('min_referral_payout', '100', 'Minimum amount to trigger referral payout')
ON CONFLICT (key) DO NOTHING;

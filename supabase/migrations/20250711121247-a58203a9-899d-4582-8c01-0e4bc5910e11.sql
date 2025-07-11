
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned');
CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE game_status AS ENUM ('active', 'inactive', 'upcoming', 'closed');
CREATE TYPE bet_type AS ENUM ('single_ank', 'jodi', 'single_patti', 'double_patti', 'triple_patti');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'bet', 'win', 'bonus', 'referral');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE payment_method AS ENUM ('upi', 'razorpay', 'bank_transfer', 'usdt_trc20');

-- Users table with profiles, KYC status, referral codes
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    avatar_url TEXT,
    balance_inr DECIMAL(10,2) DEFAULT 0.00,
    balance_gbp DECIMAL(10,2) DEFAULT 0.00,
    status user_status DEFAULT 'active',
    kyc_status kyc_status DEFAULT 'pending',
    kyc_documents JSONB,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.users(id),
    is_admin BOOLEAN DEFAULT false,
    upi_id TEXT,
    bank_account JSONB,
    usdt_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Games table with dynamic timing, multipliers, status
CREATE TABLE public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    opening_time TIME NOT NULL,
    closing_time TIME,
    result_time TIME,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    status game_status DEFAULT 'active',
    multipliers JSONB NOT NULL DEFAULT '{
        "single_ank": 10,
        "jodi": 90,
        "single_patti": 140,
        "double_patti": 280,
        "triple_patti": 600
    }',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Bets table with multiple bet types, amounts, results
CREATE TABLE public.bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    bet_type bet_type NOT NULL,
    numbers INTEGER[] NOT NULL,
    amount_inr DECIMAL(10,2) NOT NULL,
    potential_win DECIMAL(10,2) NOT NULL,
    is_winner BOOLEAN DEFAULT false,
    actual_win DECIMAL(10,2) DEFAULT 0.00,
    bet_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions table for deposits/withdrawals
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status transaction_status DEFAULT 'pending',
    payment_method payment_method,
    external_id TEXT,
    description TEXT,
    commission DECIMAL(10,2) DEFAULT 0.00,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Results table for daily game outcomes
CREATE TABLE public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    result_date DATE NOT NULL,
    winning_number INTEGER NOT NULL,
    declared_at TIMESTAMPTZ,
    total_bets INTEGER DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    total_payout DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(game_id, result_date)
);

-- Settings table for admin-controlled bonuses, commissions
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Referrals table for tracking referral program
CREATE TABLE public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bonus_amount DECIMAL(10,2) DEFAULT 0.00,
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(referrer_id, referee_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id OR (SELECT is_admin FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for games
CREATE POLICY "Anyone can view active games" ON public.games
    FOR SELECT USING (is_active = true OR (SELECT is_admin FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Only admins can manage games" ON public.games
    FOR ALL USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for bets
CREATE POLICY "Users can view their own bets" ON public.bets
    FOR SELECT USING (auth.uid() = user_id OR (SELECT is_admin FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can place bets" ON public.bets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all bets" ON public.bets
    FOR ALL USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id OR (SELECT is_admin FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can create transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all transactions" ON public.transactions
    FOR ALL USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for results
CREATE POLICY "Anyone can view results" ON public.results
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage results" ON public.results
    FOR ALL USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for settings
CREATE POLICY "Anyone can view settings" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage settings" ON public.settings
    FOR ALL USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- RLS Policies for referrals
CREATE POLICY "Users can view their own referrals" ON public.referrals
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id OR (SELECT is_admin FROM public.users WHERE id = auth.uid()));

CREATE POLICY "System can create referrals" ON public.referrals
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage referrals" ON public.referrals
    FOR ALL USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()));

-- Insert default games
INSERT INTO public.games (name, opening_time, result_time, multipliers) VALUES
('Desawar', '04:30:00', '04:30:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Gali', '23:00:00', '23:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Faridabad', '18:15:00', '18:15:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Ghaziabad', '20:00:00', '20:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Shri Ganesh', '17:30:00', '17:30:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Rajdhani Day', '15:00:00', '15:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Rajdhani Night', '21:00:00', '21:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Kalyan', '15:45:00', '17:45:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Mumbai Day', '13:00:00', '13:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Mumbai Night', '21:30:00', '21:30:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Main Bazar', '21:00:00', '21:00:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Milan Day', '14:30:00', '14:30:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}'),
('Milan Night', '20:30:00', '20:30:00', '{"single_ank": 10, "jodi": 90, "single_patti": 140, "double_patti": 280, "triple_patti": 600}');

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
('signup_bonus', '{"amount": 100, "currency": "INR"}', 'Bonus amount given to new users on signup'),
('welcome_bonus', '{"amount": 50, "currency": "INR"}', 'Welcome bonus for first-time users'),
('referral_bonus', '{"amount": 200, "currency": "INR"}', 'Bonus amount for successful referrals'),
('withdrawal_commission', '{"upi": 0.02, "bank_transfer": 0.05, "usdt_trc20": 0.01}', 'Commission rates for different withdrawal methods'),
('exchange_rate', '{"gbp_to_inr": 102.50}', 'Current exchange rate from GBP to INR'),
('min_withdrawal', '{"amount": 100, "currency": "INR"}', 'Minimum withdrawal amount'),
('max_withdrawal', '{"amount": 100000, "currency": "INR"}', 'Maximum withdrawal amount per day');

-- Create functions for common operations
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'MTK' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, referral_code)
    VALUES (
        NEW.id,
        NEW.email,
        generate_referral_code()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user balance
CREATE OR REPLACE FUNCTION update_user_balance(
    user_uuid UUID,
    amount DECIMAL(10,2),
    currency TEXT DEFAULT 'INR'
)
RETURNS BOOLEAN AS $$
BEGIN
    IF currency = 'INR' THEN
        UPDATE public.users
        SET balance_inr = balance_inr + amount,
            updated_at = now()
        WHERE id = user_uuid;
    ELSIF currency = 'GBP' THEN
        UPDATE public.users
        SET balance_gbp = balance_gbp + amount,
            updated_at = now()
        WHERE id = user_uuid;
    END IF;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_referral_code ON public.users(referral_code);
CREATE INDEX idx_bets_user_id ON public.bets(user_id);
CREATE INDEX idx_bets_game_id ON public.bets(game_id);
CREATE INDEX idx_bets_bet_date ON public.bets(bet_date);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_results_game_id ON public.results(game_id);
CREATE INDEX idx_results_result_date ON public.results(result_date);

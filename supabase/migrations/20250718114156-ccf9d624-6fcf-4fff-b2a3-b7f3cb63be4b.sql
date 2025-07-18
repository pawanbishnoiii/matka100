-- Phase 3: Enhanced Game System Tables
CREATE TABLE IF NOT EXISTS public.game_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  opening_time TIME NOT NULL,
  closing_time TIME NOT NULL,
  result_time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  winning_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(game_id, scheduled_date)
);

-- Phase 4: Enhanced Wallet & Payment System
CREATE TABLE IF NOT EXISTS public.razorpay_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- in paise
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'authorized', 'captured', 'refunded', 'failed')),
  payment_method TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.commission_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type TEXT NOT NULL,
  rate_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  min_amount DECIMAL(10,2) DEFAULT 0.00,
  max_amount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Phase 5: Admin Analytics & Management
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.users(id),
  action_type TEXT NOT NULL,
  target_type TEXT, -- 'user', 'game', 'transaction', etc.
  target_id UUID,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Phase 6: Enhanced Notification System
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT UNIQUE NOT NULL,
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  notification_type TEXT DEFAULT 'info',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  game_results BOOLEAN DEFAULT true,
  payment_updates BOOLEAN DEFAULT true,
  promotional BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Phase 7: Security & Audit
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  ip_address INET,
  action_type TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, ip_address, action_type)
);

-- Phase 8: Social Features
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  period_type TEXT DEFAULT 'weekly' CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly')),
  period_start DATE NOT NULL,
  total_wins INTEGER DEFAULT 0,
  total_amount_won DECIMAL(15,2) DEFAULT 0.00,
  games_played INTEGER DEFAULT 0,
  win_percentage DECIMAL(5,2) DEFAULT 0.00,
  rank_position INTEGER,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, period_type, period_start)
);

-- Enable RLS
ALTER TABLE public.game_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.razorpay_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Game Schedules
CREATE POLICY "Anyone can view active game schedules" ON public.game_schedules FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage game schedules" ON public.game_schedules FOR ALL USING (is_admin_context());

-- Razorpay Payments
CREATE POLICY "Users can view own payments" ON public.razorpay_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payments" ON public.razorpay_payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all payments" ON public.razorpay_payments FOR ALL USING (is_admin_context());

-- Commission Settings
CREATE POLICY "Anyone can view commission settings" ON public.commission_settings FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage commission settings" ON public.commission_settings FOR ALL USING (is_admin_context());

-- Admin Actions
CREATE POLICY "Admins can view admin actions" ON public.admin_actions FOR SELECT USING (is_admin_context());
CREATE POLICY "Admins can create admin actions" ON public.admin_actions FOR INSERT WITH CHECK (is_admin_context());

-- Notification Templates
CREATE POLICY "Anyone can view active templates" ON public.notification_templates FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage templates" ON public.notification_templates FOR ALL USING (is_admin_context());

-- User Notification Preferences
CREATE POLICY "Users can manage own preferences" ON public.user_notification_preferences FOR ALL USING (auth.uid() = user_id);

-- Audit Logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (is_admin_context());
CREATE POLICY "System can create audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- Rate Limits
CREATE POLICY "System can manage rate limits" ON public.rate_limits FOR ALL USING (true);

-- User Achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage achievements" ON public.user_achievements FOR ALL USING (is_admin_context());

-- Leaderboards
CREATE POLICY "Anyone can view leaderboards" ON public.leaderboards FOR SELECT USING (true);
CREATE POLICY "System can manage leaderboards" ON public.leaderboards FOR ALL USING (true);

-- Insert default commission settings
INSERT INTO public.commission_settings (transaction_type, rate_percentage, min_amount) VALUES
('p2p_transfer', 2.00, 100.00),
('withdrawal', 1.50, 50.00),
('deposit_bonus', 0.50, 10.00)
ON CONFLICT DO NOTHING;

-- Insert default notification templates
INSERT INTO public.notification_templates (template_name, title_template, message_template, notification_type) VALUES
('game_result', 'Game Result: {game_name}', 'The result for {game_name} is {winning_number}. Check if you won!', 'info'),
('payment_success', 'Payment Successful', 'Your payment of ₹{amount} has been successfully processed.', 'success'),
('withdrawal_processed', 'Withdrawal Processed', 'Your withdrawal of ₹{amount} has been processed successfully.', 'success'),
('bet_placed', 'Bet Placed', 'Your bet of ₹{amount} on {game_name} has been placed successfully.', 'info'),
('welcome', 'Welcome to Game Bazaar!', 'Welcome! Start playing and winning big!', 'success')
ON CONFLICT (template_name) DO NOTHING;
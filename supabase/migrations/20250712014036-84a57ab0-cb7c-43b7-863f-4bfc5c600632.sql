
-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public, owner, created_at, updated_at)
VALUES ('avatars', 'avatars', true, null, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Fix users table to ensure all required fields have proper defaults
ALTER TABLE public.users 
ALTER COLUMN uui_id SET DEFAULT ('UUI' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8))),
ALTER COLUMN referral_code SET DEFAULT ('MTK' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)));

-- Update existing users without UUI ID or referral codes
UPDATE public.users 
SET uui_id = 'UUI' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8))
WHERE uui_id IS NULL OR uui_id = '';

UPDATE public.users 
SET referral_code = 'MTK' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6))
WHERE referral_code IS NULL OR referral_code = '';

-- Create legal pages table for privacy policy, terms, etc.
CREATE TABLE IF NOT EXISTS public.legal_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for legal pages
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read legal pages
CREATE POLICY "Anyone can view legal pages" ON public.legal_pages
FOR SELECT USING (true);

-- Only admins can manage legal pages
CREATE POLICY "Only admins can manage legal pages" ON public.legal_pages
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Insert default legal pages
INSERT INTO public.legal_pages (page_type, title, content) VALUES
('privacy', 'Privacy Policy', 'Your privacy is important to us. This privacy policy explains how we collect, use, and protect your information when you use our Matka gaming platform.'),
('terms', 'Terms & Conditions', 'By using our platform, you agree to these terms and conditions. Please read them carefully before using our services.'),
('refund', 'Refund Policy', 'Our refund policy outlines the conditions under which refunds may be processed for transactions on our platform.'),
('cookies', 'Cookie Policy', 'We use cookies to enhance your experience on our platform. This policy explains how we use cookies and your choices regarding them.')
ON CONFLICT (page_type) DO NOTHING;

-- Add exchange rate settings for currency conversion
INSERT INTO public.settings (key, value, description) VALUES
('exchange_rates', '{"inr_to_gbp": 0.012, "gbp_to_inr": 83.33, "last_updated": "2025-01-12"}'::jsonb, 'Currency exchange rates for INR/GBP conversion'),
('site_settings', '{"maintenance_mode": false, "allow_registrations": true, "kyc_required": false}'::jsonb, 'General site configuration settings')
ON CONFLICT (key) DO NOTHING;

-- Create a function to generate unique UUI IDs
CREATE OR REPLACE FUNCTION generate_unique_uui()
RETURNS TEXT AS $$
DECLARE
    new_uui TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        new_uui := 'UUI' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
        SELECT COUNT(*) INTO exists_check FROM public.users WHERE uui_id = new_uui;
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN new_uui;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate UUI ID for new users
CREATE OR REPLACE FUNCTION public.set_user_defaults()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.uui_id IS NULL OR NEW.uui_id = '' THEN
        NEW.uui_id := generate_unique_uui();
    END IF;
    
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        NEW.referral_code := 'MTK' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for the function
DROP TRIGGER IF EXISTS set_user_defaults_trigger ON public.users;
CREATE TRIGGER set_user_defaults_trigger
    BEFORE INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.set_user_defaults();

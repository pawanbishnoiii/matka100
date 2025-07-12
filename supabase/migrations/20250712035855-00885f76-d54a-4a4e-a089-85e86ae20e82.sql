
-- Create table for manual deposits
CREATE TABLE public.manual_deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  utr_number TEXT NOT NULL,
  transaction_id TEXT,
  payment_method TEXT NOT NULL DEFAULT 'upi',
  screenshot_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  processed_by UUID REFERENCES public.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on manual deposits
ALTER TABLE public.manual_deposits ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own deposits
CREATE POLICY "Users can view own manual deposits" 
  ON public.manual_deposits 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to create their own deposits
CREATE POLICY "Users can create manual deposits" 
  ON public.manual_deposits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for admins to manage all manual deposits
CREATE POLICY "Admins can manage all manual deposits" 
  ON public.manual_deposits 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create storage bucket for deposit screenshots if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('deposit-screenshots', 'deposit-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for deposit screenshots
CREATE POLICY "Users can upload deposit screenshots" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'deposit-screenshots' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their deposit screenshots" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'deposit-screenshots' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all deposit screenshots" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'deposit-screenshots' AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Function to update user balance when manual deposit is approved
CREATE OR REPLACE FUNCTION public.handle_manual_deposit_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only process when status changes to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Update user balance
    UPDATE public.users
    SET 
      balance_inr = balance_inr + NEW.amount,
      updated_at = now()
    WHERE id = NEW.user_id;
    
    -- Create transaction record
    INSERT INTO public.transactions (
      user_id,
      type,
      amount,
      currency,
      status,
      description,
      external_id,
      payment_method
    ) VALUES (
      NEW.user_id,
      'deposit',
      NEW.amount,
      NEW.currency,
      'completed',
      'Manual deposit approved - UTR: ' || NEW.utr_number,
      NEW.id::text,
      NEW.payment_method::payment_method
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for manual deposit approval
CREATE TRIGGER on_manual_deposit_status_change
  AFTER UPDATE ON public.manual_deposits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_manual_deposit_approval();

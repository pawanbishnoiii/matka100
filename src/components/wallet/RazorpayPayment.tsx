import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  onSuccess?: () => void;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({ onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) < 10) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum amount is ₹10',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to make a payment',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'razorpay-create-order',
        {
          body: {
            amount: parseFloat(amount),
            currency: 'INR',
            description: `Wallet recharge - ₹${amount}`,
          },
        }
      );

      if (orderError) throw orderError;

      // Initialize Razorpay payment
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Game Bazaar',
        description: 'Wallet Recharge',
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke(
              'razorpay-verify-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              }
            );

            if (verifyError) throw verifyError;

            toast({
              title: 'Payment Successful!',
              description: `₹${amount} has been added to your wallet`,
            });

            setAmount('');
            onSuccess?.();
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              title: 'Payment Verification Failed',
              description: 'Please contact support if amount was deducted',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: () => {
            toast({
              title: 'Payment Cancelled',
              description: 'Payment was cancelled by user',
              variant: 'destructive',
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-gaming-card border-gaming-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <CreditCard className="w-5 h-5 text-gaming-primary" />
            Instant Recharge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gaming-text-secondary">
              Enter Amount (₹)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum ₹10"
              min="10"
              className="bg-gaming-input border-gaming-border text-white"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label className="text-gaming-text-secondary">Quick Select</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`border-gaming-border ${
                    amount === quickAmount.toString()
                      ? 'bg-gaming-primary text-black border-gaming-primary'
                      : 'text-gaming-text hover:bg-gaming-hover'
                  }`}
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={loading || !amount || parseFloat(amount) < 10}
            className="w-full bg-gradient-to-r from-gaming-primary to-gaming-accent hover:opacity-90 text-black font-semibold py-3"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Processing...' : `Pay ₹${amount || '0'}`}
          </Button>

          {/* Security Info */}
          <div className="flex items-center gap-2 text-sm text-gaming-text-secondary bg-gaming-darker/50 p-3 rounded-lg">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Secured by Razorpay. Your payment information is safe and encrypted.</span>
          </div>

          {/* Payment Methods Info */}
          <div className="text-xs text-gaming-text-secondary space-y-1">
            <p>✓ UPI (GPay, PhonePe, Paytm)</p>
            <p>✓ Credit/Debit Cards</p>
            <p>✓ Net Banking</p>
            <p>✓ Wallet (Paytm, Mobikwik)</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RazorpayPayment;
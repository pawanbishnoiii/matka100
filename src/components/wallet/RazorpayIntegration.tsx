
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayIntegrationProps {
  onSuccess?: () => void;
}

export const RazorpayIntegration = ({ onSuccess }: RazorpayIntegrationProps) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
        title: 'Error',
        description: 'Minimum deposit amount is ₹10',
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
        'razorpay-payment',
        {
          body: {
            amount: parseFloat(amount),
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
              purpose: 'Wallet deposit'
            }
          }
        }
      );

      if (orderError) {
        throw new Error(orderError.message || 'Failed to create order');
      }

      // Initialize Razorpay payment
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Matka100',
        description: 'Wallet Deposit',
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke(
              'razorpay-verify',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }
              }
            );

            if (verifyError) {
              throw new Error(verifyError.message || 'Payment verification failed');
            }

            toast({
              title: 'Success!',
              description: `₹${amount} has been added to your wallet`,
            });

            setAmount('');
            onSuccess?.();
          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast({
              title: 'Payment Error',
              description: error.message || 'Payment verification failed',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            toast({
              title: 'Payment Cancelled',
              description: 'Payment was cancelled by user',
              variant: 'destructive',
            });
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initiate payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CreditCard className="w-5 h-5 text-blue-400" />
          Instant Deposit via Razorpay
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter Amount (₹)
          </label>
          <Input
            type="number"
            placeholder="Minimum ₹10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white"
            min="10"
          />
        </div>
        
        <Button
          onClick={handlePayment}
          disabled={loading || !amount}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ₹{amount || '0'} Now
            </>
          )}
        </Button>

        <div className="text-xs text-gray-400 text-center">
          <p>• Instant deposit • Secure payment • 24/7 available</p>
          <p>• All major cards accepted • UPI supported</p>
        </div>
      </CardContent>
    </Card>
  );
};

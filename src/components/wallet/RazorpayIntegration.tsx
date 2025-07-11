
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayIntegration = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [razorpayConfig, setRazorpayConfig] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch Razorpay configuration
    fetchRazorpayConfig();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchRazorpayConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'razorpay_config')
        .single();

      if (error) throw error;
      setRazorpayConfig(data.value);
    } catch (error) {
      console.error('Error fetching Razorpay config:', error);
    }
  };

  const handlePayment = async () => {
    if (!user || !amount || !razorpayConfig?.key_id) {
      toast({
        title: 'Error',
        description: 'Please enter amount and ensure Razorpay is configured',
        variant: 'destructive',
      });
      return;
    }

    if (!razorpayConfig.enabled) {
      toast({
        title: 'Error',
        description: 'Razorpay payments are currently disabled',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const paymentAmount = parseFloat(amount);
      
      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: paymentAmount,
          status: 'pending',
          payment_method: 'razorpay',
          description: 'Razorpay deposit'
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      const options = {
        key: razorpayConfig.key_id,
        amount: paymentAmount * 100, // Convert to paisa
        currency: 'INR',
        name: 'Matka Platform',
        description: 'Wallet Top-up',
        order_id: transaction.id,
        handler: async (response: any) => {
          try {
            // Update transaction status
            await supabase
              .from('transactions')
              .update({ 
                status: 'completed',
                external_id: response.razorpay_payment_id,
                metadata: {
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  signature: response.razorpay_signature
                }
              })
              .eq('id', transaction.id);

            // Update user balance
            await supabase.rpc('update_user_balance', {
              user_uuid: user.id,
              amount: paymentAmount
            });

            toast({
              title: 'Success',
              description: `₹${paymentAmount} added to your wallet successfully`,
            });

            setAmount('');
          } catch (error) {
            console.error('Payment success handler error:', error);
            toast({
              title: 'Error',
              description: 'Payment completed but failed to update balance. Contact support.',
              variant: 'destructive',
            });
          }
        },
        modal: {
          ondismiss: async () => {
            // Update transaction status to cancelled
            await supabase
              .from('transactions')
              .update({ status: 'cancelled' })
              .eq('id', transaction.id);
          }
        },
        prefill: {
          name: user.email,
          email: user.email,
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Payment failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!razorpayConfig) {
    return (
      <Card className="glass-card border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-white">Loading payment options...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="glass-card border-gray-700 neon-blue-glow">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            Instant Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">
              Amount to Add (₹)
            </label>
            <Input
              type="number"
              step="0.01"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white text-lg p-4"
              placeholder="Enter amount"
            />
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[100, 500, 1000, 2000].map((value) => (
                <Button
                  key={value}
                  onClick={() => setAmount(value.toString())}
                  variant="outline"
                  className="glass-card border-gray-600 hover:bg-gray-700/50"
                >
                  ₹{value}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h4 className="text-white font-semibold">Instant Payment</h4>
            </div>
            <p className="text-gray-300 text-sm">
              Pay securely with cards, UPI, net banking & wallets. Money gets added instantly to your account.
            </p>
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading || !amount || parseFloat(amount) <= 0 || !razorpayConfig?.enabled}
            className="w-full neon-glow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 text-lg"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {loading ? 'Processing...' : `Pay ₹${amount || '0'} Now`}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-400">
              Powered by Razorpay • 100% Secure • SSL Encrypted
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RazorpayIntegration;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Loader2, AlertCircle, CheckCircle, IndianRupee } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const cancelPayment = async (orderId: string, reason: string) => {
    try {
      console.log('Cancelling payment for order:', orderId);
      
      const { data, error } = await supabase.functions.invoke('razorpay-cancel', {
        body: {
          order_id: orderId,
          reason: reason
        }
      });

      if (error) {
        console.error('Payment cancellation error:', error);
      } else {
        console.log('Payment cancelled successfully:', data);
      }
    } catch (error) {
      console.error('Failed to cancel payment:', error);
    }
  };

  const handlePayment = async () => {
    const amountValue = parseFloat(amount);
    
    if (!amount || amountValue < 10) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum deposit amount is ₹10',
        variant: 'destructive',
      });
      return;
    }

    if (amountValue > 100000) {
      toast({
        title: 'Amount Too High',
        description: 'Maximum deposit amount is ₹100,000',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');
    setErrorMessage('');
    setCurrentOrderId(null);

    try {
      console.log('Starting payment process for amount:', amountValue);

      // Load Razorpay script
      console.log('Loading Razorpay script...');
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection and try again.');
      }
      console.log('Razorpay script loaded successfully');

      // Create order
      console.log('Creating payment order...');
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'razorpay-payment',
        {
          body: {
            amount: amountValue,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
              purpose: 'Wallet deposit',
              user_action: 'manual_deposit'
            }
          }
        }
      );

      console.log('Order creation response:', { orderData, orderError });

      if (orderError) {
        console.error('Order creation failed:', orderError);
        throw new Error(orderError.message || 'Failed to create payment order. Please try again.');
      }

      if (!orderData || !orderData.success) {
        console.error('Invalid order response:', orderData);
        const errorMsg = orderData?.error || 'Invalid payment order response';
        
        // Handle specific error cases
        if (errorMsg.includes('not configured')) {
          throw new Error('Payment system is not configured yet. Please contact support.');
        } else if (errorMsg.includes('credentials')) {
          throw new Error('Payment gateway configuration issue. Please contact support.');
        } else if (errorMsg.includes('similar deposit request')) {
          throw new Error('A similar deposit request is already pending. Please wait before trying again.');
        } else {
          throw new Error(errorMsg);
        }
      }

      console.log('Payment order created successfully:', orderData.order_id);
      setCurrentOrderId(orderData.order_id);

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
            console.log('Payment completed, verifying...', response);
            setPaymentStatus('processing');

            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'razorpay-verify',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }
              }
            );

            console.log('Verification response:', { verifyData, verifyError });

            if (verifyError || !verifyData?.success) {
              console.error('Payment verification failed:', verifyError);
              throw new Error(verifyError?.message || verifyData?.error || 'Payment verification failed');
            }

            console.log('Payment verified successfully');
            setPaymentStatus('success');

            toast({
              title: 'Payment Successful! 🎉',
              description: `₹${amount} has been added to your wallet`,
            });

            setAmount('');
            setCurrentOrderId(null);
            if (onSuccess) {
              onSuccess();
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            setPaymentStatus('error');
            setErrorMessage(error.message || 'Payment verification failed');
            
            toast({
              title: 'Payment Verification Failed',
              description: error.message || 'Please contact support if amount was deducted',
              variant: 'destructive',
            });
          } finally {
            setLoading(false);
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
          ondismiss: async () => {
            console.log('Payment cancelled by user');
            
            // Cancel the payment in backend if order was created
            if (currentOrderId) {
              await cancelPayment(currentOrderId, 'cancelled_by_user');
            }
            
            setLoading(false);
            setPaymentStatus('idle');
            setCurrentOrderId(null);
            
            toast({
              title: 'Payment Cancelled',
              description: 'Payment was cancelled by user',
              variant: 'destructive',
            });
          }
        }
      };

      console.log('Opening Razorpay checkout...');
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment initialization error:', error);
      
      // Cancel any pending transaction if order was created
      if (currentOrderId) {
        await cancelPayment(currentOrderId, 'initialization_error');
      }
      
      setLoading(false);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Failed to initialize payment');
      setCurrentOrderId(null);
      
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
    setAmount('');
    setCurrentOrderId(null);
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
        {paymentStatus === 'error' && (
          <Alert className="border-red-600 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              <strong>Error:</strong> {errorMessage}
              <Button 
                variant="link" 
                size="sm" 
                onClick={resetPayment}
                className="text-red-400 hover:text-red-300 p-0 ml-2 h-auto"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'success' && (
          <Alert className="border-green-600 bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              <strong>Success!</strong> Payment completed successfully! Your wallet has been updated.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter Amount (₹)
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="number"
              placeholder="Minimum ₹10, Maximum ₹100,000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white pl-10"
              min="10"
              max="100000"
              disabled={loading || paymentStatus === 'processing'}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Enter amount between ₹10 and ₹100,000
          </p>
        </div>
        
        <Button
          onClick={handlePayment}
          disabled={loading || !amount || paymentStatus === 'processing'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {loading || paymentStatus === 'processing' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {paymentStatus === 'processing' ? 'Processing Payment...' : 'Initializing...'}
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ₹{amount || '0'} Now
            </>
          )}
        </Button>

        <div className="text-xs text-gray-400 text-center space-y-1">
          <p>• Instant deposit • Secure payment • 24/7 available</p>
          <p>• All major cards accepted • UPI supported</p>
          <p>• Powered by Razorpay - India's most trusted payment gateway</p>
        </div>
      </CardContent>
    </Card>
  );
};

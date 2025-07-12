
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, Building2, Smartphone, Bitcoin, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentSettings {
  min_withdrawal_amount: number;
  max_withdrawal_amount: number;
  withdrawal_fee_percentage: number;
}

export const EnhancedWithdrawalForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'INR',
    payment_method: 'upi',
    upi_id: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
    usdt_address: '',
    notes: ''
  });

  useEffect(() => {
    fetchUserBalance();
    fetchPaymentSettings();
  }, []);

  const fetchUserBalance = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('balance_inr')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserBalance(data?.balance_inr || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('min_withdrawal_amount, max_withdrawal_amount, withdrawal_fee_percentage')
        .single();

      if (error) throw error;
      setPaymentSettings(data);
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    }
  };

  const paymentMethods = [
    { 
      value: 'upi', 
      label: 'UPI Payment', 
      icon: Smartphone, 
      color: 'text-green-400',
      fields: ['upi_id']
    },
    { 
      value: 'bank_transfer', 
      label: 'Bank Transfer', 
      icon: Building2, 
      color: 'text-blue-400',
      fields: ['bank_name', 'account_number', 'ifsc_code', 'account_holder_name']
    },
    { 
      value: 'usdt_trc20', 
      label: 'USDT (TRC20)', 
      icon: Bitcoin, 
      color: 'text-orange-400',
      fields: ['usdt_address']
    }
  ];

  const selectedMethod = paymentMethods.find(method => method.value === formData.payment_method);

  const calculateFee = () => {
    if (!paymentSettings || !formData.amount) return 0;
    const amount = parseFloat(formData.amount);
    return (amount * paymentSettings.withdrawal_fee_percentage) / 100;
  };

  const calculateNetAmount = () => {
    const amount = parseFloat(formData.amount) || 0;
    const fee = calculateFee();
    return amount - fee;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !paymentSettings) return;

    const amount = parseFloat(formData.amount);
    const fee = calculateFee();
    const netAmount = calculateNetAmount();

    // Validation
    if (!amount || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid withdrawal amount',
        variant: 'destructive',
      });
      return;
    }

    if (amount < paymentSettings.min_withdrawal_amount) {
      toast({
        title: 'Amount Too Low',
        description: `Minimum withdrawal amount is ₹${paymentSettings.min_withdrawal_amount}`,
        variant: 'destructive',
      });
      return;
    }

    if (amount > paymentSettings.max_withdrawal_amount) {
      toast({
        title: 'Amount Too High',
        description: `Maximum withdrawal amount is ₹${paymentSettings.max_withdrawal_amount}`,
        variant: 'destructive',
      });
      return;
    }

    if (amount > userBalance) {
      toast({
        title: 'Insufficient Balance',
        description: 'Your withdrawal amount exceeds available balance',
        variant: 'destructive',
      });
      return;
    }

    // Validate required fields based on payment method
    const requiredFields = selectedMethod?.fields || [];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: 'Missing Information',
          description: `Please fill in all required ${selectedMethod?.label} details`,
          variant: 'destructive',
        });
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: amount,
          currency: formData.currency,
          status: 'pending',
          payment_method: formData.payment_method,
          commission: fee,
          description: `Withdrawal request - ${selectedMethod?.label}`,
          metadata: {
            payment_details: {
              upi_id: formData.upi_id || null,
              bank_name: formData.bank_name || null,
              account_number: formData.account_number || null,
              ifsc_code: formData.ifsc_code || null,
              account_holder_name: formData.account_holder_name || null,
              usdt_address: formData.usdt_address || null,
            },
            fees: {
              withdrawal_fee: fee,
              net_amount: netAmount
            },
            notes: formData.notes || null
          }
        });

      if (error) throw error;

      toast({
        title: 'Withdrawal Request Submitted! 🎉',
        description: `Your withdrawal request for ₹${amount} has been submitted. Admin will process it within 24 hours.`,
      });

      // Reset form
      setFormData({
        amount: '',
        currency: 'INR',
        payment_method: 'upi',
        upi_id: '',
        bank_name: '',
        account_number: '',
        ifsc_code: '',
        account_holder_name: '',
        usdt_address: '',
        notes: ''
      });

      fetchUserBalance();

    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit withdrawal request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!paymentSettings) {
    return (
      <Card className="glass-card border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-white">Loading withdrawal settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-white hindi-font flex items-center gap-2">
          <Wallet className="w-6 h-6 text-red-400" />
          Withdrawal Request
        </CardTitle>
        <div className="flex items-center justify-between bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg p-4">
          <div>
            <p className="text-sm text-gray-400">Available Balance</p>
            <p className="text-2xl font-bold text-green-400">₹{userBalance.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Withdrawal Limits</p>
            <p className="text-sm text-white">₹{paymentSettings.min_withdrawal_amount} - ₹{paymentSettings.max_withdrawal_amount.toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label className="text-white">Withdrawal Amount *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white pl-10 text-lg font-semibold"
                placeholder="Enter amount"
                min={paymentSettings.min_withdrawal_amount}
                max={Math.min(paymentSettings.max_withdrawal_amount, userBalance)}
              />
            </div>
            {formData.amount && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Withdrawal Amount:</span>
                  <span className="text-white">₹{parseFloat(formData.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Processing Fee ({paymentSettings.withdrawal_fee_percentage}%):</span>
                  <span className="text-red-400">-₹{calculateFee().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t border-yellow-500/30 pt-2 mt-2">
                  <span className="text-yellow-400">You will receive:</span>
                  <span className="text-green-400">₹{calculateNetAmount().toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label className="text-white">Payment Method *</Label>
            <Select value={formData.payment_method} onValueChange={(value) => handleInputChange('payment_method', value)}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <div className="flex items-center gap-2">
                      <method.icon className={`w-4 h-4 ${method.color}`} />
                      {method.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Payment Details Form */}
          {selectedMethod && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-r ${
                selectedMethod.value === 'upi' ? 'from-green-900/30 to-emerald-900/30' :
                selectedMethod.value === 'bank_transfer' ? 'from-blue-900/30 to-indigo-900/30' :
                'from-orange-900/30 to-red-900/30'
              } border border-gray-600 rounded-lg p-4 space-y-4`}
            >
              <h4 className={`font-semibold flex items-center gap-2 ${selectedMethod.color}`}>
                <selectedMethod.icon className="w-5 h-5" />
                {selectedMethod.label} Details
              </h4>

              {/* UPI Fields */}
              {selectedMethod.value === 'upi' && (
                <div className="space-y-2">
                  <Label className="text-white">UPI ID *</Label>
                  <Input
                    value={formData.upi_id}
                    onChange={(e) => handleInputChange('upi_id', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="your@upi"
                  />
                </div>
              )}

              {/* Bank Transfer Fields */}
              {selectedMethod.value === 'bank_transfer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Account Holder Name *</Label>
                    <Input
                      value={formData.account_holder_name}
                      onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Bank Name *</Label>
                    <Input
                      value={formData.bank_name}
                      onChange={(e) => handleInputChange('bank_name', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="State Bank of India"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Account Number *</Label>
                    <Input
                      value={formData.account_number}
                      onChange={(e) => handleInputChange('account_number', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white font-mono"
                      placeholder="1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">IFSC Code *</Label>
                    <Input
                      value={formData.ifsc_code}
                      onChange={(e) => handleInputChange('ifsc_code', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white font-mono"
                      placeholder="SBIN0001234"
                    />
                  </div>
                </div>
              )}

              {/* USDT Fields */}
              {selectedMethod.value === 'usdt_trc20' && (
                <div className="space-y-2">
                  <Label className="text-white">USDT TRC-20 Address *</Label>
                  <Input
                    value={formData.usdt_address}
                    onChange={(e) => handleInputChange('usdt_address', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                    placeholder="TRC-20 wallet address"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-white">Additional Notes (Optional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Add any additional information..."
              rows={3}
            />
          </div>

          {/* Important Notice */}
          <Alert className="border-yellow-600 bg-yellow-900/20">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              <strong>Important:</strong> Withdrawal requests are processed within 24 hours. Please ensure all details are correct as changes cannot be made after submission.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !formData.amount || parseFloat(formData.amount) <= 0}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Processing Request...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Submit Withdrawal Request
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

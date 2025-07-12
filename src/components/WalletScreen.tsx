
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Minus, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, Bitcoin, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
  payment_method: string;
}

interface PaymentSettings {
  min_deposit_amount: number;
  max_deposit_amount: number;
  min_withdrawal_amount: number;
  max_withdrawal_amount: number;
  withdrawal_fee_percentage: number;
  upi_id: string;
  usdt_trc20_address: string;
}

export const WalletScreen = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingPaymentSettings, setLoadingPaymentSettings] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState({ inr: 0, gbp: 0 });
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'usdt_trc20' | 'bank_transfer'>('upi');
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    min_deposit_amount: 10,
    max_deposit_amount: 100000,
    min_withdrawal_amount: 50,
    max_withdrawal_amount: 50000,
    withdrawal_fee_percentage: 2,
    upi_id: '',
    usdt_trc20_address: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserBalance();
      fetchTransactions();
      fetchPaymentSettings();
    }
  }, [user]);

  const fetchUserBalance = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('balance_inr, balance_gbp')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setBalance({
          inr: data.balance_inr || 0,
          gbp: data.balance_gbp || 0
        });
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transaction history',
        variant: 'destructive',
      });
    }
  };

  const fetchPaymentSettings = async () => {
    setLoadingPaymentSettings(true);
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching payment settings:', error);
        throw error;
      }

      if (data) {
        setPaymentSettings({
          min_deposit_amount: data.min_deposit_amount || 10,
          max_deposit_amount: data.max_deposit_amount || 100000,
          min_withdrawal_amount: data.min_withdrawal_amount || 50,
          max_withdrawal_amount: data.max_withdrawal_amount || 50000,
          withdrawal_fee_percentage: data.withdrawal_fee_percentage || 2,
          upi_id: data.upi_id || '',
          usdt_trc20_address: data.usdt_trc20_address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      toast({
        title: 'Warning',
        description: 'Payment settings not configured. Contact admin.',
        variant: 'destructive',
      });
    } finally {
      setLoadingPaymentSettings(false);
    }
  };

  const handleDeposit = async () => {
    if (!user || !amount) return;

    const depositAmount = parseFloat(amount);
    if (depositAmount < paymentSettings.min_deposit_amount || depositAmount > paymentSettings.max_deposit_amount) {
      toast({
        title: 'Invalid Amount',
        description: `Deposit amount must be between ₹${paymentSettings.min_deposit_amount} and ₹${paymentSettings.max_deposit_amount}`,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Create pending transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: depositAmount,
          currency: 'INR',
          status: 'pending',
          payment_method: selectedMethod,
          description: `Deposit via ${selectedMethod.toUpperCase()}`
        });

      if (transactionError) throw transactionError;

      toast({
        title: 'Deposit Request Created',
        description: 'Your deposit request has been submitted for processing.',
      });

      setAmount('');
      fetchTransactions();
    } catch (error) {
      console.error('Error creating deposit:', error);
      toast({
        title: 'Error',
        description: 'Failed to create deposit request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!user || !amount) return;

    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount < paymentSettings.min_withdrawal_amount || withdrawalAmount > paymentSettings.max_withdrawal_amount) {
      toast({
        title: 'Invalid Amount',
        description: `Withdrawal amount must be between ₹${paymentSettings.min_withdrawal_amount} and ₹${paymentSettings.max_withdrawal_amount}`,
        variant: 'destructive',
      });
      return;
    }

    if (withdrawalAmount > balance.inr) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough balance for this withdrawal',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Create pending withdrawal transaction
      const fee = (withdrawalAmount * paymentSettings.withdrawal_fee_percentage) / 100;
      const finalAmount = withdrawalAmount - fee;

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: withdrawalAmount,
          currency: 'INR',
          status: 'pending',
          payment_method: selectedMethod,
          commission: fee,
          description: `Withdrawal via ${selectedMethod.toUpperCase()} (Fee: ₹${fee.toFixed(2)})`
        });

      if (transactionError) throw transactionError;

      toast({
        title: 'Withdrawal Request Created',
        description: `Your withdrawal request for ₹${finalAmount.toFixed(2)} has been submitted.`,
      });

      setAmount('');
      fetchTransactions();
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      toast({
        title: 'Error',
        description: 'Failed to create withdrawal request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'upi': return <Smartphone className="w-4 h-4" />;
      case 'usdt_trc20': return <Bitcoin className="w-4 h-4" />;
      case 'bank_transfer': return <Building2 className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'cancelled': return 'text-gray-400';
      default: return 'text-yellow-400';
    }
  };

  if (loadingPaymentSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
        <Card className="glass-card border-gray-700 max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse text-white">Loading wallet...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">INR Balance</CardTitle>
                <Wallet className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">₹{balance.inr.toLocaleString()}</div>
                <p className="text-xs text-gray-400">Available for games</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">GBP Balance</CardTitle>
                <Wallet className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">£{balance.gbp.toLocaleString()}</div>
                <p className="text-xs text-gray-400">International balance</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Transaction Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white hindi-font">Wallet Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="deposit" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                  <TabsTrigger value="deposit" className="text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Deposit
                  </TabsTrigger>
                  <TabsTrigger value="withdraw" className="text-white">
                    <Minus className="w-4 h-4 mr-2" />
                    Withdraw
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="deposit" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Payment Method</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                        <Button
                          variant={selectedMethod === 'upi' ? 'default' : 'outline'}
                          onClick={() => setSelectedMethod('upi')}
                          className="flex items-center gap-2"
                          disabled={!paymentSettings.upi_id}
                        >
                          <Smartphone className="w-4 h-4" />
                          UPI
                        </Button>
                        <Button
                          variant={selectedMethod === 'usdt_trc20' ? 'default' : 'outline'}
                          onClick={() => setSelectedMethod('usdt_trc20')}
                          className="flex items-center gap-2"
                          disabled={!paymentSettings.usdt_trc20_address}
                        >
                          <Bitcoin className="w-4 h-4" />
                          USDT TRC-20
                        </Button>
                        <Button
                          variant={selectedMethod === 'bank_transfer' ? 'default' : 'outline'}
                          onClick={() => setSelectedMethod('bank_transfer')}
                          className="flex items-center gap-2"
                        >
                          <Building2 className="w-4 h-4" />
                          Bank Transfer
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Amount (₹)</Label>
                      <Input
                        type="number"
                        placeholder={`Min: ₹${paymentSettings.min_deposit_amount}, Max: ₹${paymentSettings.max_deposit_amount}`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white mt-2"
                      />
                    </div>

                    <Button
                      onClick={handleDeposit}
                      disabled={loading || !amount}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {loading ? 'Processing...' : 'Create Deposit Request'}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="withdraw" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Payment Method</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                        <Button
                          variant={selectedMethod === 'upi' ? 'default' : 'outline'}
                          onClick={() => setSelectedMethod('upi')}
                          className="flex items-center gap-2"
                        >
                          <Smartphone className="w-4 h-4" />
                          UPI
                        </Button>
                        <Button
                          variant={selectedMethod === 'usdt_trc20' ? 'default' : 'outline'}
                          onClick={() => setSelectedMethod('usdt_trc20')}
                          className="flex items-center gap-2"
                        >
                          <Bitcoin className="w-4 h-4" />
                          USDT TRC-20
                        </Button>
                        <Button
                          variant={selectedMethod === 'bank_transfer' ? 'default' : 'outline'}
                          onClick={() => setSelectedMethod('bank_transfer')}
                          className="flex items-center gap-2"
                        >
                          <Building2 className="w-4 h-4" />
                          Bank Transfer
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Amount (₹)</Label>
                      <Input
                        type="number"
                        placeholder={`Min: ₹${paymentSettings.min_withdrawal_amount}, Max: ₹${paymentSettings.max_withdrawal_amount}`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white mt-2"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Fee: {paymentSettings.withdrawal_fee_percentage}% • Available: ₹{balance.inr.toLocaleString()}
                      </p>
                    </div>

                    <Button
                      onClick={handleWithdrawal}
                      disabled={loading || !amount}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      {loading ? 'Processing...' : 'Create Withdrawal Request'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white hindi-font">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No transactions found</p>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        {getPaymentMethodIcon(transaction.payment_method)}
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </p>
                        <p className={`text-xs ${getStatusColor(transaction.status)}`}>
                          {transaction.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

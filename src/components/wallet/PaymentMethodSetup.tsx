
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Building2, Smartphone, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ManualDepositForm from './ManualDepositForm';
import ManualDepositHistory from './ManualDepositHistory';

const PaymentMethodSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    payment_method: 'upi',
    upi_id: '',
    bank_account: '',
    ifsc_code: '',
    account_holder: ''
  });

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!withdrawalData.amount || parseFloat(withdrawalData.amount) < 50) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum withdrawal amount is ₹50',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Create withdrawal request
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: parseFloat(withdrawalData.amount),
          currency: 'INR',
          status: 'pending',
          description: `Withdrawal request via ${withdrawalData.payment_method}`,
          payment_method: withdrawalData.payment_method as any,
          metadata: {
            upi_id: withdrawalData.upi_id || null,
            bank_account: withdrawalData.bank_account || null,
            ifsc_code: withdrawalData.ifsc_code || null,
            account_holder: withdrawalData.account_holder || null
          }
        });

      if (error) throw error;

      toast({
        title: 'Withdrawal Requested',
        description: 'Your withdrawal request has been submitted for processing',
      });

      setWithdrawalData({
        amount: '',
        payment_method: 'upi',
        upi_id: '',
        bank_account: '',
        ifsc_code: '',
        account_holder: ''
      });
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      toast({
        title: 'Withdrawal Failed',
        description: 'Failed to submit withdrawal request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="deposit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass-card p-1">
          <TabsTrigger value="deposit" className="data-[state=active]:bg-green-600 text-white">
            Manual Deposit
          </TabsTrigger>
          <TabsTrigger value="withdrawal" className="data-[state=active]:bg-red-600 text-white">
            Withdrawal
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 text-white">
            Deposit History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <ManualDepositForm />
        </TabsContent>

        <TabsContent value="withdrawal">
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-400" />
                Withdrawal Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdrawal} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Withdrawal Amount</Label>
                  <Input
                    type="number"
                    min="50"
                    step="0.01"
                    placeholder="Enter amount (Min: ₹50)"
                    value={withdrawalData.amount}
                    onChange={(e) => setWithdrawalData(prev => ({ ...prev, amount: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                  <p className="text-xs text-gray-400">Minimum withdrawal: ₹50 | Maximum: ₹50,000</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Payment Method</Label>
                  <Select 
                    value={withdrawalData.payment_method} 
                    onValueChange={(value) => setWithdrawalData(prev => ({ ...prev, payment_method: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="upi">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-green-400" />
                          UPI
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-400" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {withdrawalData.payment_method === 'upi' && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">UPI ID</Label>
                    <Input
                      type="text"
                      placeholder="Enter your UPI ID"
                      value={withdrawalData.upi_id}
                      onChange={(e) => setWithdrawalData(prev => ({ ...prev, upi_id: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                )}

                {withdrawalData.payment_method === 'bank_transfer' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Account Holder Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter account holder name"
                        value={withdrawalData.account_holder}
                        onChange={(e) => setWithdrawalData(prev => ({ ...prev, account_holder: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Account Number</Label>
                      <Input
                        type="text"
                        placeholder="Enter account number"
                        value={withdrawalData.bank_account}
                        onChange={(e) => setWithdrawalData(prev => ({ ...prev, bank_account: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">IFSC Code</Label>
                      <Input
                        type="text"
                        placeholder="Enter IFSC code"
                        value={withdrawalData.ifsc_code}
                        onChange={(e) => setWithdrawalData(prev => ({ ...prev, ifsc_code: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {loading ? 'Processing...' : 'Request Withdrawal'}
                </Button>

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">Withdrawal Information</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Processing time: 2-24 hours</li>
                    <li>• Minimum amount: ₹50</li>
                    <li>• Maximum amount: ₹50,000 per day</li>
                    <li>• Small processing fee may apply</li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <ManualDepositHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentMethodSetup;

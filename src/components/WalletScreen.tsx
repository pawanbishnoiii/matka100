import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Wallet as WalletIcon,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EnhancedManualDepositForm from './wallet/EnhancedManualDepositForm';
import { EnhancedWithdrawalForm } from './wallet/EnhancedWithdrawalForm';

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  commission?: number;
  metadata: any;
  created_at: string;
}

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isDeposit = transaction.type === 'deposit';
  const statusColors = {
    pending: 'text-yellow-500',
    completed: 'text-green-500',
    failed: 'text-red-500',
    cancelled: 'text-gray-500',
  };

  return (
    <motion.div
      className="glass-card p-4 rounded-lg border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isDeposit ? (
            <ArrowUpCircle className="w-6 h-6 text-green-500" />
          ) : (
            <ArrowDownCircle className="w-6 h-6 text-red-500" />
          )}
          <div>
            <p className="text-lg font-semibold text-white">
              ₹{transaction.amount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 capitalize">
              {transaction.type} • {transaction.payment_method}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(transaction.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold ${statusColors[transaction.status]}`}>
            {transaction.status}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const WalletScreen = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch user balance
      const { data: balanceData, error: balanceError } = await supabase
        .from('users')
        .select('balance_inr')
        .eq('id', user.id)
        .single();

      if (balanceError) throw balanceError;
      setBalance(balanceData?.balance_inr || 0);

      // Fetch transaction history
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch wallet data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white hindi-font">
              My Wallet
            </h1>
            <p className="text-gray-400">Manage your funds and transactions</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400">Available Balance</p>
            <p className="text-3xl font-bold text-green-400">₹{balance.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="balance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="space-y-6">
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <WalletIcon className="w-5 h-5 text-green-400" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-gray-400">Available Balance</p>
                <p className="text-5xl font-bold text-green-400">₹{balance.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deposit" className="space-y-6">
          <EnhancedManualDepositForm />
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-6">
          <EnhancedWithdrawalForm />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No transactions found</div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletScreen;

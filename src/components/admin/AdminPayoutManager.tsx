
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  metadata: any;
  created_at: string;
  users: {
    name: string;
    email: string;
    upi_id: string;
    bank_account: any;
    usdt_address: string;
  };
}

interface AdminPayoutManagerProps {
  onStatsUpdate: () => void;
}

export const AdminPayoutManager = ({ onStatsUpdate }: AdminPayoutManagerProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  const fetchTransactions = async () => {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          users (
            name,
            email,
            upi_id,
            bank_account,
            usdt_address
          )
        `)
        .eq('type', 'withdrawal')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTransactionStatus = async (transactionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Transaction ${newStatus} successfully`,
      });
      fetchTransactions();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to update transaction',
        variant: 'destructive',
      });
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'upi':
        return <Smartphone className="w-4 h-4" />;
      case 'bank_transfer':
        return <Banknote className="w-4 h-4" />;
      case 'usdt_trc20':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPaymentDetails = (transaction: Transaction) => {
    const { users, payment_method, metadata } = transaction;
    
    switch (payment_method) {
      case 'upi':
        return users?.upi_id || 'UPI ID not provided';
      case 'bank_transfer':
        return users?.bank_account 
          ? `${users.bank_account.account_number} - ${users.bank_account.bank_name}`
          : 'Bank details not provided';
      case 'usdt_trc20':
        return users?.usdt_address || 'USDT address not provided';
      default:
        return 'Payment details not available';
    }
  };

  if (loading) {
    return (
      <Card className="glass-card border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-white">Loading transactions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white hindi-font flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-yellow-400" />
          Payout Management System
        </CardTitle>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="all">All Status</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No {statusFilter !== 'all' ? statusFilter : ''} transactions found
            </div>
          ) : (
            transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 rounded-lg border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                      {getPaymentMethodIcon(transaction.payment_method)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {transaction.users?.name || transaction.users?.email}
                      </h3>
                      <p className="text-gray-400 text-sm">{transaction.users?.email}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{transaction.payment_method?.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      ₹{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Commission: ₹{(transaction.commission || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'pending'
                        ? 'bg-yellow-600/20 text-yellow-400'
                        : transaction.status === 'completed'
                        ? 'bg-green-600/20 text-green-400'
                        : transaction.status === 'failed'
                        ? 'bg-red-600/20 text-red-400'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {transaction.status.toUpperCase()}
                    </div>

                    {transaction.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTransactionStatus(transaction.id, 'completed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateTransactionStatus(transaction.id, 'failed')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Payment Details:</p>
                  <p className="text-white text-sm font-mono">
                    {getPaymentDetails(transaction)}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  CreditCard, 
  Wallet,
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  payment_method: string | null;
  description: string | null;
  created_at: string;
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

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
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine className="w-5 h-5" />;
      case 'withdrawal':
        return <ArrowUpFromLine className="w-5 h-5" />;
      case 'bet':
        return <CreditCard className="w-5 h-5" />;
      case 'win':
        return <Wallet className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'win':
        return 'bg-green-600/20 text-green-400';
      case 'withdrawal':
      case 'bet':
        return 'bg-red-600/20 text-red-400';
      default:
        return 'bg-blue-600/20 text-blue-400';
    }
  };

  const getAmountPrefix = (type: string) => {
    return type === 'deposit' || type === 'win' ? '+' : '-';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
                <div className="h-12 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-white hindi-font flex items-center gap-2">
          <History className="w-5 h-5 text-blue-400" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <motion.div 
                key={transaction.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-white font-semibold capitalize">
                        {transaction.type === 'bet' ? 'Bet Placed' : 
                         transaction.type === 'win' ? 'Winning Amount' : transaction.type}
                      </p>
                      <p className="text-sm text-gray-400">
                        {transaction.payment_method || 'System'} • {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'deposit' || transaction.type === 'win' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {getAmountPrefix(transaction.type)}₹{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{transaction.status}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;

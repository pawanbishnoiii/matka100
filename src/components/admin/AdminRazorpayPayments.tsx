
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CreditCard, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  IndianRupee
} from 'lucide-react';

interface RazorpayTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  external_id: string;
  payment_method: string;
  description: string;
  created_at: string;
  updated_at: string;
  metadata: any;
  users: {
    name: string;
    email: string;
    uui_id: string;
  };
}

export const AdminRazorpayPayments = () => {
  const [transactions, setTransactions] = useState<RazorpayTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          users:user_id (
            name,
            email,
            uui_id
          )
        `)
        .eq('payment_method', 'razorpay')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const processedData = data?.map(transaction => ({
        ...transaction,
        users: transaction.users || { name: 'Unknown', email: 'Unknown', uui_id: 'Unknown' }
      })) || [];

      setTransactions(processedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch Razorpay transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
    
    toast({
      title: 'Refreshed',
      description: 'Transaction data has been updated',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600/20 text-green-400 border-green-600/50"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/50"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-600/20 text-red-400 border-red-600/50"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-600/20 text-gray-400 border-gray-600/50"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.users.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.users.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.external_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.users.uui_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    failed: transactions.filter(t => t.status === 'failed').length,
    cancelled: transactions.filter(t => t.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Razorpay Payments</h2>
            <p className="text-gray-400">Monitor and manage Razorpay transactions</p>
          </div>
        </div>
        
        <Card className="glass-card border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse text-white">Loading transactions...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Razorpay Payments</h2>
          <p className="text-gray-400">Monitor and manage Razorpay transactions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="glass-card border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-green-700/50">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-yellow-700/50">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-red-700/50">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
              <div className="text-sm text-gray-400">Failed</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-gray-700/50">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{stats.cancelled}</div>
              <div className="text-sm text-gray-400">Cancelled</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="text-white">Transaction History</CardTitle>
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, UUI, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white pl-10 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-800/50 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button
                onClick={refreshTransactions}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <motion.div 
                  key={transaction.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <IndianRupee className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold">{transaction.users.name}</p>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-sm text-gray-400">
                          {transaction.users.email} • UUI: {transaction.users.uui_id}
                        </p>
                        <p className="text-xs text-gray-500">
                          Order: {transaction.external_id} • {new Date(transaction.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white text-lg">
                        ₹{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">{transaction.currency}</p>
                    </div>
                  </div>
                  
                  {transaction.metadata && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <details className="text-xs text-gray-400">
                        <summary className="cursor-pointer hover:text-gray-300">
                          <Eye className="inline w-3 h-3 mr-1" />
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-800/50 rounded text-xs overflow-auto">
                          {JSON.stringify(transaction.metadata, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

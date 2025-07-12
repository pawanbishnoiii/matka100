
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  IndianRupee,
  AlertTriangle,
  MessageSquare,
  Ban
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [selectedTransaction, setSelectedTransaction] = useState<RazorpayTransaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'cancel' | 'view'>('view');
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);
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

  const handleTransactionAction = async () => {
    if (!selectedTransaction) return;

    setProcessing(true);
    try {
      if (actionType === 'approve' && selectedTransaction.status === 'pending') {
        // Update transaction to completed and update user balance
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            status: 'completed',
            metadata: {
              ...selectedTransaction.metadata,
              admin_approved: true,
              admin_approved_at: new Date().toISOString(),
              admin_reason: reason || 'Manually approved by admin'
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTransaction.id);

        if (updateError) throw updateError;

        // Update user balance
        const { error: balanceError } = await supabase.rpc('update_user_balance', {
          user_uuid: selectedTransaction.user_id,
          amount: selectedTransaction.amount,
          currency: selectedTransaction.currency || 'INR'
        });

        if (balanceError) throw balanceError;

        toast({
          title: 'Payment Approved',
          description: `₹${selectedTransaction.amount} has been added to user's wallet`,
        });
      } else if (actionType === 'cancel') {
        // Cancel transaction
        const { error: cancelError } = await supabase
          .from('transactions')
          .update({
            status: 'cancelled',
            metadata: {
              ...selectedTransaction.metadata,
              admin_cancelled: true,
              admin_cancelled_at: new Date().toISOString(),
              cancellation_reason: reason || 'Cancelled by admin'
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTransaction.id);

        if (cancelError) throw cancelError;

        toast({
          title: 'Payment Cancelled',
          description: 'Transaction has been cancelled successfully',
        });
      }

      await fetchTransactions();
      setDialogOpen(false);
      setReason('');
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to process transaction',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const openDialog = (transaction: RazorpayTransaction, action: 'approve' | 'cancel' | 'view') => {
    setSelectedTransaction(transaction);
    setActionType(action);
    setDialogOpen(true);
    setReason('');
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
        return <Badge className="bg-gray-600/20 text-gray-400 border-gray-600/50"><Ban className="w-3 h-3 mr-1" />Cancelled</Badge>;
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
    totalAmount: transactions.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0)
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Razorpay Management</h2>
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
          <h2 className="text-2xl font-bold text-white">Razorpay Management</h2>
          <p className="text-gray-400">Monitor and manage Razorpay transactions</p>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
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
        <Card className="glass-card border-blue-700/50">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">₹{(stats.totalAmount / 1000).toFixed(0)}K</div>
              <div className="text-sm text-gray-400">Revenue</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="text-white">Transaction Management</CardTitle>
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
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-white text-lg">
                          ₹{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">{transaction.currency}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(transaction, 'view')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {transaction.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => openDialog(transaction, 'approve')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openDialog(transaction, 'cancel')}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Payment' : 
               actionType === 'cancel' ? 'Cancel Payment' : 'Transaction Details'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedTransaction && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span>User:</span>
                    <span>{selectedTransaction.users.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>₹{selectedTransaction.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="text-sm">{selectedTransaction.external_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span>{getStatusBadge(selectedTransaction.status)}</span>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {actionType !== 'view' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  {actionType === 'approve' ? 'Approval Reason (Optional)' : 'Cancellation Reason'}
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={actionType === 'approve' ? 'Enter approval reason...' : 'Enter cancellation reason...'}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {actionType === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {actionType !== 'view' && (
              <Button
                onClick={handleTransactionAction}
                disabled={processing}
                className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {processing ? 'Processing...' : 
                 actionType === 'approve' ? 'Approve Payment' : 'Cancel Payment'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

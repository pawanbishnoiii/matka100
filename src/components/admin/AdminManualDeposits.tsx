
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Eye, Download, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ManualDeposit {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  utr_number: string;
  transaction_id: string | null;
  screenshot_url: string | null;
  notes: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  processed_at: string | null;
  user_details: {
    name: string | null;
    email: string;
    uui_id: string | null;
  } | null;
}

const AdminManualDeposits = () => {
  const [deposits, setDeposits] = useState<ManualDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedDeposit, setSelectedDeposit] = useState<ManualDeposit | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDeposits();
  }, [filter]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('manual_deposits')
        .select(`
          *,
          users!manual_deposits_user_id_fkey (
            name,
            email,
            uui_id
          )
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Transform the data to match our interface
      const transformedData = (data || []).map(deposit => ({
        ...deposit,
        user_details: deposit.users ? {
          name: deposit.users.name,
          email: deposit.users.email,
          uui_id: deposit.users.uui_id
        } : null
      }));

      setDeposits(transformedData);
    } catch (error) {
      console.error('Error fetching manual deposits:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch manual deposits',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const processDeposit = async (depositId: string, status: 'approved' | 'rejected', notes: string) => {
    if (!user) return;

    try {
      setProcessing(depositId);
      
      const { error } = await supabase
        .from('manual_deposits')
        .update({
          status,
          admin_notes: notes || null,
          processed_by: user.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', depositId);

      if (error) throw error;

      toast({
        title: `Deposit ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `Manual deposit has been ${status} successfully`,
      });

      await fetchDeposits();
    } catch (error) {
      console.error('Error processing deposit:', error);
      toast({
        title: 'Processing Failed',
        description: 'Failed to process manual deposit',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
      setSelectedDeposit(null);
      setAdminNotes('');
    }
  };

  const viewScreenshot = async (screenshotPath: string) => {
    try {
      const { data } = await supabase.storage
        .from('deposit-screenshots')
        .createSignedUrl(screenshotPath, 3600); // 1 hour expiry
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error viewing screenshot:', error);
      toast({
        title: 'Error',
        description: 'Failed to load screenshot',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
            className={filter === status ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Deposits List */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Manual Deposit Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
                  <div className="h-20 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : deposits.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No {filter !== 'all' ? filter : ''} deposits found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deposits.map((deposit) => (
                <motion.div
                  key={deposit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(deposit.status)}
                      <div>
                        <p className="text-white font-semibold">
                          ₹{deposit.amount.toLocaleString()} - {deposit.payment_method.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-400">
                          User: {deposit.user_details?.name || deposit.user_details?.email} 
                          {deposit.user_details?.uui_id && ` (${deposit.user_details.uui_id})`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(deposit.status)} capitalize`}>
                        {deposit.status}
                      </Badge>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(deposit.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-400">UTR Number:</p>
                      <p className="text-white font-mono">{deposit.utr_number}</p>
                    </div>
                    {deposit.transaction_id && (
                      <div>
                        <p className="text-sm text-gray-400">Transaction ID:</p>
                        <p className="text-white font-mono">{deposit.transaction_id}</p>
                      </div>
                    )}
                  </div>

                  {deposit.notes && (
                    <div className="mb-4 p-3 bg-gray-800/50 rounded">
                      <p className="text-sm text-gray-400">User Notes:</p>
                      <p className="text-gray-300">{deposit.notes}</p>
                    </div>
                  )}

                  {deposit.admin_notes && (
                    <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                      <p className="text-sm text-blue-400 font-semibold">Admin Notes:</p>
                      <p className="text-gray-300">{deposit.admin_notes}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {deposit.screenshot_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewScreenshot(deposit.screenshot_url!)}
                          className="text-gray-300 border-gray-600 hover:bg-gray-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Screenshot
                        </Button>
                      )}
                    </div>

                    {deposit.status === 'pending' && (
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedDeposit(deposit);
                                setAdminNotes('');
                              }}
                              className="text-red-400 border-red-600 hover:bg-red-900/20"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Reject Deposit</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-gray-300">Rejection Reason</Label>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Explain why this deposit is being rejected..."
                                  className="bg-gray-700 border-gray-600 text-white"
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedDeposit(null)}
                                  className="border-gray-600"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => processDeposit(deposit.id, 'rejected', adminNotes)}
                                  disabled={processing === deposit.id}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {processing === deposit.id ? 'Processing...' : 'Reject'}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedDeposit(deposit);
                                setAdminNotes('');
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Approve Deposit</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded">
                                <p className="text-green-400 font-semibold">Approval Confirmation</p>
                                <p className="text-gray-300">₹{deposit.amount.toLocaleString()} will be added to user's balance</p>
                              </div>
                              <div>
                                <Label className="text-gray-300">Approval Notes (Optional)</Label>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Add any notes about this approval..."
                                  className="bg-gray-700 border-gray-600 text-white"
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  onClick={() => setSelectedDeposit(null)}
                                  className="border-gray-600"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => processDeposit(deposit.id, 'approved', adminNotes)}
                                  disabled={processing === deposit.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {processing === deposit.id ? 'Processing...' : 'Approve'}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManualDeposits;

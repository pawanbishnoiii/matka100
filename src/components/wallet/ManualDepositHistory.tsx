
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ManualDeposit {
  id: string;
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
}

const ManualDepositHistory = () => {
  const [deposits, setDeposits] = useState<ManualDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDeposits();
    }
  }, [user]);

  const fetchDeposits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('manual_deposits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeposits(data || []);
    } catch (error) {
      console.error('Error fetching manual deposits:', error);
    } finally {
      setLoading(false);
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

  const downloadScreenshot = async (screenshotPath: string) => {
    try {
      const { data } = await supabase.storage
        .from('deposit-screenshots')
        .download(screenshotPath);
      
      if (data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deposit-screenshot-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading screenshot:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Manual Deposit History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-4 rounded-lg animate-pulse">
                <div className="h-16 bg-gray-700 rounded"></div>
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
        <CardTitle className="text-white">Manual Deposit History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deposits.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No manual deposit requests yet</p>
            </div>
          ) : (
            deposits.map((deposit) => (
              <motion.div
                key={deposit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(deposit.status)}
                    <div>
                      <p className="text-white font-semibold">
                        ₹{deposit.amount.toLocaleString()} - {deposit.payment_method.toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-400">
                        UTR: {deposit.utr_number}
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

                {deposit.transaction_id && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-400">
                      Transaction ID: <span className="text-gray-300">{deposit.transaction_id}</span>
                    </p>
                  </div>
                )}

                {deposit.notes && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-400">
                      Notes: <span className="text-gray-300">{deposit.notes}</span>
                    </p>
                  </div>
                )}

                {deposit.admin_notes && (
                  <div className="mb-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                    <p className="text-sm text-blue-400 font-semibold">Admin Notes:</p>
                    <p className="text-sm text-gray-300">{deposit.admin_notes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {deposit.screenshot_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadScreenshot(deposit.screenshot_url!)}
                        className="text-gray-300 border-gray-600 hover:bg-gray-700"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Screenshot
                      </Button>
                    )}
                  </div>
                  
                  {deposit.processed_at && (
                    <p className="text-xs text-gray-400">
                      Processed: {formatDate(deposit.processed_at)}
                    </p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualDepositHistory;

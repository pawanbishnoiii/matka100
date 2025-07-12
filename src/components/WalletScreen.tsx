
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Minus, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, Bitcoin, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import WalletBalance from './wallet/WalletBalance';
import TransactionHistory from './wallet/TransactionHistory';
import PaymentMethodSetup from './wallet/PaymentMethodSetup';
import P2PTransfer from './wallet/P2PTransfer';
import { RazorpayIntegration } from './wallet/RazorpayIntegration';

export const WalletScreen = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'INR' | 'GBP'>('INR');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('Fetching user data for:', user?.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch profile data. Please refresh the page.',
          variant: 'destructive',
        });
        return;
      }

      console.log('User data fetched successfully:', data);
      setUserData(data);
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wallet data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white hindi-font">Digital Wallet</h1>
              <p className="text-gray-400">Manage your funds securely</p>
            </div>
          </div>
        </motion.div>

        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <WalletBalance currency={currency} onCurrencyChange={setCurrency} />
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="deposit" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 glass-card p-1">
              <TabsTrigger value="deposit" className="data-[state=active]:bg-green-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Deposit
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-red-600 text-white">
                <Minus className="w-4 h-4 mr-2" />
                Withdraw
              </TabsTrigger>
              <TabsTrigger value="transfer" className="data-[state=active]:bg-blue-600 text-white">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Transfer
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-purple-600 text-white">
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Razorpay Integration */}
                <RazorpayIntegration onSuccess={fetchUserData} />
                
                {/* Manual Payment Methods */}
                <Card className="glass-card border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-yellow-400" />
                      Manual Deposit Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <Button 
                        variant="outline" 
                        className="justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Smartphone className="w-4 h-4 mr-3 text-green-400" />
                        UPI Payment
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Building2 className="w-4 h-4 mr-3 text-blue-400" />
                        Bank Transfer
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Bitcoin className="w-4 h-4 mr-3 text-orange-400" />
                        USDT (TRC20)
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      Manual verification required • 5-30 minutes processing
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="withdraw">
              <PaymentMethodSetup />
            </TabsContent>

            <TabsContent value="transfer">
              <P2PTransfer />
            </TabsContent>

            <TabsContent value="history">
              <TransactionHistory />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

// Add default export
export default WalletScreen;

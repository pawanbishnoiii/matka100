
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Minus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import WalletBalance from './wallet/WalletBalance';
import TransactionHistory from './wallet/TransactionHistory';
import PaymentMethodSetup from './wallet/PaymentMethodSetup';
import P2PTransfer from './wallet/P2PTransfer';
import { RazorpayIntegration } from './wallet/RazorpayIntegration';
import EnhancedManualDepositForm from './wallet/EnhancedManualDepositForm';

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
        if (error.code === 'PGRST116') {
          console.log('User not found in users table, creating...');
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: user?.id,
              email: user?.email || '',
              name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
              balance_inr: 0,
              balance_gbp: 0,
              status: 'active',
              kyc_status: 'pending',
              is_admin: user?.email === 'bnoy.studios@gmail.com'
            });
          
          if (insertError) {
            console.error('Error creating user:', insertError);
            throw insertError;
          }
          
          const { data: newData, error: newError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user?.id)
            .single();
          
          if (newError) throw newError;
          setUserData(newData);
        } else {
          throw error;
        }
      } else {
        console.log('User data fetched successfully:', data);
        setUserData(data);
      }
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
                <EnhancedManualDepositForm />
                <RazorpayIntegration onSuccess={fetchUserData} />
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

export default WalletScreen;

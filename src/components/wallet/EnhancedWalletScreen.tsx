import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Plus, Send, History, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletBalance from './WalletBalance';
import RazorpayPayment from './RazorpayPayment';
import EnhancedManualDepositForm from './EnhancedManualDepositForm';
import EnhancedWithdrawalForm from './EnhancedWithdrawalForm';
import P2PTransfer from './P2PTransfer';
import TransactionHistory from './TransactionHistory';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const EnhancedWalletScreen = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currency, setCurrency] = useState<'INR' | 'GBP'>('INR');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: 'Refreshed',
      description: 'Wallet data has been refreshed',
    });
  };

  const handlePaymentSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark to-black p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-gaming-primary" />
            <div>
              <h1 className="text-3xl font-bold text-white">My Wallet</h1>
              <p className="text-gaming-text-secondary">Manage your gaming funds</p>
            </div>
          </div>
          
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-black"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </motion.div>

        {/* Wallet Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          key={refreshKey}
        >
          <WalletBalance 
            currency={currency} 
            onCurrencyChange={setCurrency} 
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Button
            onClick={() => setActiveTab('deposit')}
            className="h-20 flex-col gap-2 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
          >
            <Plus className="w-6 h-6" />
            <span>Add Money</span>
          </Button>
          
          <Button
            onClick={() => setActiveTab('withdraw')}
            className="h-20 flex-col gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
          >
            <ArrowUpRight className="w-6 h-6" />
            <span>Withdraw</span>
          </Button>
          
          <Button
            onClick={() => setActiveTab('transfer')}
            className="h-20 flex-col gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
          >
            <Send className="w-6 h-6" />
            <span>Transfer</span>
          </Button>
          
          <Button
            onClick={() => setActiveTab('history')}
            className="h-20 flex-col gap-2 bg-gaming-card border border-gaming-border text-gaming-text hover:bg-gaming-hover"
          >
            <History className="w-6 h-6" />
            <span>History</span>
          </Button>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-5 bg-gaming-card border-gaming-border">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="deposit" 
                className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black"
              >
                Deposit
              </TabsTrigger>
              <TabsTrigger 
                value="withdraw" 
                className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black"
              >
                Withdraw
              </TabsTrigger>
              <TabsTrigger 
                value="transfer" 
                className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black"
              >
                Transfer
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black"
              >
                History
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gaming-card border-gaming-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <CreditCard className="w-5 h-5 text-gaming-primary" />
                      Quick Deposit
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gaming-text-secondary">
                      Add money to your wallet instantly using multiple payment methods.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[100, 500, 1000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab('deposit')}
                          className="border-gaming-border text-gaming-text hover:bg-gaming-hover"
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={() => setActiveTab('deposit')}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white"
                    >
                      Add Money
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gaming-card border-gaming-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <History className="w-5 h-5 text-gaming-accent" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionHistory limit={5} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('history')}
                      className="w-full mt-4 border-gaming-border text-gaming-text hover:bg-gaming-hover"
                    >
                      View All Transactions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Deposit Tab */}
            <TabsContent value="deposit" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Instant Payment</h3>
                  <RazorpayPayment onSuccess={handlePaymentSuccess} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Manual Deposit</h3>
                  <EnhancedManualDepositForm onSuccess={handlePaymentSuccess} />
                </div>
              </div>
            </TabsContent>

            {/* Withdraw Tab */}
            <TabsContent value="withdraw" className="space-y-6">
              <EnhancedWithdrawalForm onSuccess={handlePaymentSuccess} />
            </TabsContent>

            {/* Transfer Tab */}
            <TabsContent value="transfer" className="space-y-6">
              <P2PTransfer onSuccess={handlePaymentSuccess} />
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card className="bg-gaming-card border-gaming-border">
                <CardHeader>
                  <CardTitle className="text-white">Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedWalletScreen;
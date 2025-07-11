
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  History, 
  Settings,
  Send
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './auth/AuthModal';
import WalletBalance from './wallet/WalletBalance';
import TransactionHistory from './wallet/TransactionHistory';
import PaymentMethodSetup from './wallet/PaymentMethodSetup';
import P2PTransfer from './wallet/P2PTransfer';
import RazorpayIntegration from './wallet/RazorpayIntegration';

const WalletScreen = () => {
  const [currency, setCurrency] = useState<'INR' | 'GBP'>('INR');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history' | 'p2p' | 'settings'>('deposit');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-8"></div>
          <div className="h-48 bg-gray-700 rounded mb-8"></div>
          <div className="h-96 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4 hindi-font flex items-center justify-center gap-3">
            <Wallet className="w-8 h-8 text-yellow-400" />
            My Wallet
          </h1>
        </motion.div>

        <Card className="glass-card border-gray-700 max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold text-white mb-2">Sign in Required</h2>
            <p className="text-gray-400 mb-6">Please sign in to access your wallet</p>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="neon-glow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-4 hindi-font flex items-center justify-center gap-3">
          <Wallet className="w-8 h-8 text-yellow-400" />
          My Wallet
        </h1>
      </motion.div>

      {/* Balance Card */}
      <div className="mb-8">
        <WalletBalance currency={currency} onCurrencyChange={setCurrency} />
      </div>

      {/* Action Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'deposit', label: 'Add Money', icon: ArrowDownToLine },
            { id: 'withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
            { id: 'p2p', label: 'P2P Transfer', icon: Send },
            { id: 'history', label: 'History', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 py-3 px-4 ${
                activeTab === tab.id 
                  ? 'neon-green-glow bg-gradient-to-r from-green-600 to-emerald-600' 
                  : 'glass-card hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Content Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {activeTab === 'deposit' && <RazorpayIntegration />}
        {activeTab === 'withdraw' && (
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white hindi-font flex items-center gap-2">
                <ArrowUpFromLine className="w-5 h-5 text-red-400" />
                Withdraw Money
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">
                  Withdrawal feature will be available once you set up your payment methods
                </p>
                <Button
                  onClick={() => setActiveTab('settings')}
                  className="neon-glow bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Set up Payment Methods
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {activeTab === 'p2p' && <P2PTransfer />}
        {activeTab === 'history' && <TransactionHistory />}
        {activeTab === 'settings' && <PaymentMethodSetup />}
      </motion.div>
    </div>
  );
};

export default WalletScreen;


import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  CreditCard, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  History, 
  Smartphone,
  Building,
  Bitcoin
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './auth/AuthModal';
import WalletBalance from './wallet/WalletBalance';
import TransactionHistory from './wallet/TransactionHistory';

const WalletScreen = () => {
  const [currency, setCurrency] = useState<'INR' | 'GBP'>('INR');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
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
        <div className="flex gap-4 mb-6">
          {[
            { id: 'deposit', label: 'Deposit', icon: ArrowDownToLine },
            { id: 'withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
            { id: 'history', label: 'History', icon: History }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 ${
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
        {activeTab === 'deposit' && (
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white hindi-font flex items-center gap-2">
                <ArrowDownToLine className="w-5 h-5 text-green-400" />
                Add Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Amount to Deposit:
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white text-lg p-4"
                />
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[500, 1000, 2500, 5000].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => setDepositAmount(amount.toString())}
                      variant="outline"
                      className="glass-card border-gray-600 hover:bg-gray-700/50"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Choose Payment Method:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="p-4 glass-card hover:neon-green-glow transition-all">
                    <div className="text-center">
                      <Smartphone className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                      <p className="font-semibold">UPI</p>
                      <p className="text-xs text-gray-400">Instant</p>
                    </div>
                  </Button>
                  
                  <Button className="p-4 glass-card hover:neon-green-glow transition-all">
                    <div className="text-center">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                      <p className="font-semibold">Razorpay</p>
                      <p className="text-xs text-gray-400">Cards & More</p>
                    </div>
                  </Button>
                  
                  <Button className="p-4 glass-card hover:neon-green-glow transition-all">
                    <div className="text-center">
                      <Bitcoin className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                      <p className="font-semibold">TRC20</p>
                      <p className="text-xs text-gray-400">Crypto</p>
                    </div>
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full neon-glow bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 text-lg"
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                <ArrowDownToLine className="w-5 h-5 mr-2" />
                Deposit ₹{depositAmount || '0'}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'withdraw' && (
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white hindi-font flex items-center gap-2">
                <ArrowUpFromLine className="w-5 h-5 text-red-400" />
                Withdraw Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Amount to Withdraw:
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white text-lg p-4"
                />
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[1000, 2500, 5000, 10000].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => setWithdrawAmount(amount.toString())}
                      variant="outline"
                      className="glass-card border-gray-600 hover:bg-gray-700/50"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Withdrawal Methods:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="p-4 glass-card hover:neon-green-glow transition-all">
                    <div className="text-center">
                      <Smartphone className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                      <p className="font-semibold">UPI</p>
                      <p className="text-xs text-gray-400">Instant Transfer</p>
                    </div>
                  </Button>
                  
                  <Button className="p-4 glass-card hover:neon-green-glow transition-all">
                    <div className="text-center">
                      <Building className="w-8 h-8 mx-auto mb-2 text-green-400" />
                      <p className="font-semibold">Bank Account</p>
                      <p className="text-xs text-gray-400">2-3 Hours</p>
                    </div>
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full neon-glow bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 text-lg"
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}
              >
                <ArrowUpFromLine className="w-5 h-5 mr-2" />
                Withdraw ₹{withdrawAmount || '0'}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'history' && <TransactionHistory />}
      </motion.div>
    </div>
  );
};

export default WalletScreen;

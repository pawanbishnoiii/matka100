
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  CreditCard, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  History, 
  ToggleLeft, 
  ToggleRight,
  IndianRupee,
  PoundSterling,
  Smartphone,
  Building,
  Bitcoin
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const WalletScreen = () => {
  const [balance] = useState(15750); // In INR
  const [currency, setCurrency] = useState<'INR' | 'GBP'>('INR');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');

  // Mock exchange rate
  const exchangeRate = 0.012; // 1 INR = 0.012 GBP

  const getDisplayBalance = () => {
    if (currency === 'GBP') {
      return (balance * exchangeRate).toFixed(2);
    }
    return balance.toLocaleString();
  };

  const transactions = [
    { id: 1, type: 'deposit', amount: 5000, method: 'UPI', status: 'completed', date: '2024-01-15', time: '14:30' },
    { id: 2, type: 'withdraw', amount: 2500, method: 'Bank', status: 'completed', date: '2024-01-14', time: '10:15' },
    { id: 3, type: 'deposit', amount: 1000, method: 'Razorpay', status: 'completed', date: '2024-01-13', time: '16:45' },
    { id: 4, type: 'bet', amount: 500, method: 'Game', status: 'completed', date: '2024-01-13', time: '15:20' },
    { id: 5, type: 'win', amount: 4500, method: 'Game', status: 'completed', date: '2024-01-12', time: '19:30' },
  ];

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
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8"
      >
        <Card className="glass-card border-gray-700 neon-blue-glow">
          <CardContent className="p-8">
            <div className="text-center">
              {/* Currency Toggle */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <IndianRupee className={`w-5 h-5 ${currency === 'INR' ? 'text-orange-500' : 'text-gray-500'}`} />
                <button
                  onClick={() => setCurrency(currency === 'INR' ? 'GBP' : 'INR')}
                  className="flex items-center gap-2"
                >
                  {currency === 'INR' ? (
                    <ToggleLeft className="w-8 h-8 text-orange-500" />
                  ) : (
                    <ToggleRight className="w-8 h-8 text-blue-500" />
                  )}
                </button>
                <PoundSterling className={`w-5 h-5 ${currency === 'GBP' ? 'text-blue-500' : 'text-gray-500'}`} />
              </div>

              <p className="text-gray-400 mb-2">Available Balance</p>
              <p className="text-5xl font-bold text-white mb-2">
                {currency === 'INR' ? '₹' : '£'}{getDisplayBalance()}
              </p>
              <p className="text-sm text-gray-400">
                {currency === 'INR' ? 
                  `≈ £${(balance * exchangeRate).toFixed(2)}` : 
                  `≈ ₹${balance.toLocaleString()}`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
                      disabled={amount > balance}
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
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > balance}
              >
                <ArrowUpFromLine className="w-5 h-5 mr-2" />
                Withdraw ₹{withdrawAmount || '0'}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'history' && (
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white hindi-font flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="glass-card p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-green-600/20 text-green-400' :
                          transaction.type === 'withdraw' ? 'bg-red-600/20 text-red-400' :
                          transaction.type === 'win' ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-blue-600/20 text-blue-400'
                        }`}>
                          {transaction.type === 'deposit' && <ArrowDownToLine className="w-5 h-5" />}
                          {transaction.type === 'withdraw' && <ArrowUpFromLine className="w-5 h-5" />}
                          {transaction.type === 'bet' && <CreditCard className="w-5 h-5" />}
                          {transaction.type === 'win' && <Wallet className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-white font-semibold capitalize">
                            {transaction.type === 'bet' ? 'Bet Placed' : 
                             transaction.type === 'win' ? 'Winning Amount' : transaction.type}
                          </p>
                          <p className="text-sm text-gray-400">
                            {transaction.method} • {transaction.date} {transaction.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === 'deposit' || transaction.type === 'win' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'win' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default WalletScreen;


import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Zap, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface NumberPadProps {
  onBetPlace: (number: number, amount: number) => void;
  walletBalance: number;
}

const NumberPad = ({ onBetPlace, walletBalance }: NumberPadProps) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<string>('');
  const [selectedBetType, setSelectedBetType] = useState<string>('Single Ank');

  const betTypes = {
    'Single Ank': 10,
    'Jodi': 90,
    'Single Patti': 140,
    'Double Patti': 280,
    'Triple Patti': 600
  };

  const numbers = Array.from({ length: 101 }, (_, i) => i);

  const calculatePayout = () => {
    const amount = parseFloat(betAmount) || 0;
    const multiplier = betTypes[selectedBetType as keyof typeof betTypes];
    return amount * multiplier;
  };

  const handleBetPlace = () => {
    if (selectedNumber !== null && betAmount && parseFloat(betAmount) > 0) {
      onBetPlace(selectedNumber, parseFloat(betAmount));
      setSelectedNumber(null);
      setBetAmount('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2 hindi-font">
          Choose Your Lucky Number
        </h2>
        <div className="flex items-center justify-center gap-2 text-gray-300">
          <Coins className="w-5 h-5 text-yellow-400" />
          <span>Wallet Balance: ₹{walletBalance.toLocaleString()}</span>
        </div>
      </motion.div>

      {/* Bet Type Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h3 className="text-lg font-semibold text-white mb-3 hindi-font">Select Bet Type:</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(betTypes).map(([type, multiplier]) => (
            <Button
              key={type}
              onClick={() => setSelectedBetType(type)}
              className={`p-3 rounded-xl transition-all ${
                selectedBetType === type
                  ? 'neon-green-glow bg-gradient-to-r from-green-600 to-emerald-600'
                  : 'glass-card hover:bg-gray-700/50'
              }`}
            >
              <div className="text-center">
                <p className="font-bold text-sm">{type}</p>
                <p className="text-xs text-yellow-400">₹{multiplier}x</p>
              </div>
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Number Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h3 className="text-lg font-semibold text-white mb-3 hindi-font">Select Number (0-100):</h3>
        <div className="grid grid-cols-10 md:grid-cols-20 gap-2 max-h-96 overflow-y-auto p-4 glass-card rounded-xl">
          {numbers.map((number) => (
            <motion.button
              key={number}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedNumber(number)}
              className={`aspect-square rounded-lg font-bold text-sm transition-all ${
                selectedNumber === number
                  ? 'neon-glow bg-gradient-to-br from-red-600 to-red-700 text-white'
                  : 'glass-card hover:bg-gray-700/50 text-gray-300 hover:text-white'
              }`}
            >
              {number}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Bet Amount & Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-semibold mb-2 hindi-font">
              Bet Amount (₹):
            </label>
            <Input
              type="number"
              placeholder="Enter amount (min ₹1)"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white text-lg p-4"
              min="1"
            />
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[10, 50, 100, 500].map((amount) => (
                <Button
                  key={amount}
                  onClick={() => setBetAmount(amount.toString())}
                  variant="outline"
                  className="glass-card border-gray-600 hover:bg-gray-700/50"
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="space-y-4">
              {/* Bet Summary */}
              <div className="glass-card p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Bet Summary:
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Selected Number:</span>
                    <span className="text-white font-bold">
                      {selectedNumber !== null ? selectedNumber : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bet Type:</span>
                    <span className="text-white">{selectedBetType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bet Amount:</span>
                    <span className="text-white">₹{betAmount || '0'}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-600 pt-2">
                    <span className="text-gray-400">Potential Win:</span>
                    <span className="text-green-400 font-bold">
                      ₹{calculatePayout().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Bet Button */}
              <Button
                onClick={handleBetPlace}
                disabled={selectedNumber === null || !betAmount || parseFloat(betAmount) <= 0}
                className="w-full neon-glow bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 text-lg pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5 mr-2" />
                Place Bet
                <Coins className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NumberPad;

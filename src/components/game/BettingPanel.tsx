
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Zap, Target, TrendingUp, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface BettingPanelProps {
  selectedNumbers: number[];
  onNumberRemove: (number: number) => void;
  onClearAll: () => void;
  onPlaceBet: (amount: number, numbers: number[]) => void;
  userBalance: number;
  minBet: number;
  multiplier: number;
}

const BettingPanel = ({ 
  selectedNumbers, 
  onNumberRemove, 
  onClearAll, 
  onPlaceBet, 
  userBalance, 
  minBet = 10, 
  multiplier = 4 
}: BettingPanelProps) => {
  const [betAmount, setBetAmount] = useState(minBet);
  const [totalBet, setTotalBet] = useState(0);
  const [potentialWin, setPotentialWin] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const total = betAmount * selectedNumbers.length;
    const potential = total * multiplier;
    setTotalBet(total);
    setPotentialWin(potential);
  }, [betAmount, selectedNumbers.length, multiplier]);

  const quickBetAmounts = [10, 50, 100, 500, 1000];

  const handleBetAmountChange = (amount: number) => {
    if (amount >= minBet) {
      setBetAmount(amount);
    }
  };

  const handlePlaceBet = () => {
    if (selectedNumbers.length === 0) {
      toast({
        title: "No numbers selected!",
        description: "Please select at least one number to bet on.",
        variant: "destructive"
      });
      return;
    }

    if (totalBet > userBalance) {
      toast({
        title: "Insufficient balance!",
        description: "Please add money to your wallet.",
        variant: "destructive"
      });
      return;
    }

    onPlaceBet(betAmount, selectedNumbers);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Betting Panel</h3>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          {multiplier}x Payout
        </Badge>
      </div>

      {/* Selected Numbers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Selected Numbers ({selectedNumbers.length})</span>
          {selectedNumbers.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          <AnimatePresence>
            {selectedNumbers.map((number) => (
              <motion.div
                key={number}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="relative"
              >
                <button
                  onClick={() => onNumberRemove(number)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg font-bold text-sm shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-200"
                >
                  {number}
                  <span className="ml-1 text-white/70">×</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {selectedNumbers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select numbers from the board above</p>
          </div>
        )}
      </div>

      {/* Bet Amount Section */}
      {selectedNumbers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Current Balance */}
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Balance</span>
            </div>
            <span className="font-bold text-green-400">₹{userBalance.toLocaleString()}</span>
          </div>

          {/* Bet Amount Controls */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Bet per Number</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBetAmountChange(betAmount - 10)}
                disabled={betAmount <= minBet}
                className="border-gray-600 text-gray-300"
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold text-white">₹{betAmount}</div>
                <div className="text-xs text-gray-400">per number</div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBetAmountChange(betAmount + 10)}
                className="border-gray-600 text-gray-300"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2 overflow-x-auto">
              {quickBetAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={betAmount === amount ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleBetAmountChange(amount)}
                  className={betAmount === amount 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                    : "border-gray-600 text-gray-300"
                  }
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Bet Summary */}
          <div className="space-y-2 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Bet:</span>
              <span className="text-white font-medium">₹{totalBet.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Potential Win:</span>
              <span className="text-green-400 font-bold">₹{potentialWin.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Profit:</span>
              <span className="text-yellow-400 font-bold">₹{(potentialWin - totalBet).toLocaleString()}</span>
            </div>
          </div>

          {/* Place Bet Button */}
          <Button
            onClick={handlePlaceBet}
            disabled={totalBet > userBalance}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Place Bet - ₹{totalBet.toLocaleString()}
          </Button>
        </motion.div>
      )}
    </Card>
  );
};

export default BettingPanel;

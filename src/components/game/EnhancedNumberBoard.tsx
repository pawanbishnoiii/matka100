
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Clock, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface NumberBoardProps {
  onNumberSelect: (number: number) => void;
  selectedNumbers: number[];
  minBet: number;
  multiplier: number;
}

const EnhancedNumberBoard = ({ onNumberSelect, selectedNumbers, minBet = 10, multiplier = 4 }: NumberBoardProps) => {
  const [hoveredNumber, setHoveredNumber] = useState<number | null>(null);
  const [hotNumbers, setHotNumbers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playersOnline, setPlayersOnline] = useState(847);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate hot numbers
    const hot = Array.from({ length: 10 }, () => Math.floor(Math.random() * 101));
    setHotNumbers(hot);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 30);
    }, 1000);

    // Simulate player count changes
    const playerTimer = setInterval(() => {
      setPlayersOnline(prev => prev + Math.floor(Math.random() * 10 - 5));
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(playerTimer);
    };
  }, []);

  const isSelected = (number: number) => selectedNumbers.includes(number);
  const isHot = (number: number) => hotNumbers.includes(number);

  const handleNumberClick = (number: number) => {
    onNumberSelect(number);
    
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    toast({
      title: `Number ${number} selected!`,
      description: `Potential win: ₹${(minBet * multiplier).toLocaleString()}`,
      duration: 2000,
    });
  };

  const getNumberStyle = (number: number) => {
    if (isSelected(number)) {
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50 scale-110";
    }
    if (isHot(number)) {
      return "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30";
    }
    return "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50";
  };

  return (
    <div className="space-y-6">
      {/* Game Stats Header */}
      <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Next Draw</span>
            </div>
            <div className="text-2xl font-bold text-white">{timeLeft}s</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Online</span>
            </div>
            <div className="text-2xl font-bold text-white">{playersOnline.toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Payout</span>
            </div>
            <div className="text-2xl font-bold text-white">{multiplier}x</div>
          </div>
        </div>
      </Card>

      {/* Hot Numbers Ticker */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-3 border border-orange-500/30">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-orange-400">Hot Numbers</span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {hotNumbers.slice(0, 6).map((num, index) => (
            <motion.div
              key={num}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap"
            >
              {num}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Number Grid */}
      <div className="grid grid-cols-10 gap-2 p-4 bg-black/20 backdrop-blur-xl rounded-2xl border border-gray-700/50">
        {Array.from({ length: 101 }, (_, i) => i).map((number) => (
          <motion.button
            key={number}
            onClick={() => handleNumberClick(number)}
            onMouseEnter={() => setHoveredNumber(number)}
            onMouseLeave={() => setHoveredNumber(null)}
            className={`aspect-square rounded-xl font-bold text-sm transition-all duration-200 relative overflow-hidden ${getNumberStyle(number)}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: number * 0.002 }}
          >
            {number}
            
            {/* Selection effect */}
            {isSelected(number) && (
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}

            {/* Hot number indicator */}
            {isHot(number) && !isSelected(number) && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            )}

            {/* Hover tooltip */}
            <AnimatePresence>
              {hoveredNumber === number && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10"
                >
                  Win: ₹{(minBet * multiplier).toLocaleString()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Quick Select Options */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { label: 'Lucky 7s', numbers: [7, 17, 27, 37, 47, 57, 67, 77, 87, 97] },
          { label: 'Even Numbers', numbers: Array.from({ length: 51 }, (_, i) => i * 2) },
          { label: 'Odd Numbers', numbers: Array.from({ length: 50 }, (_, i) => i * 2 + 1) },
          { label: 'High Numbers', numbers: Array.from({ length: 51 }, (_, i) => i + 50) },
        ].map((option) => (
          <Button
            key={option.label}
            variant="outline"
            size="sm"
            onClick={() => option.numbers.forEach(onNumberSelect)}
            className="whitespace-nowrap bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EnhancedNumberBoard;

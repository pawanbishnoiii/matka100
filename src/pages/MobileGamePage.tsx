
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Trophy, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import EnhancedNumberBoard from '@/components/game/EnhancedNumberBoard';
import BettingPanel from '@/components/game/BettingPanel';

const MobileGamePage = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [userBalance, setUserBalance] = useState(1500);
  const [gameActive, setGameActive] = useState(true);
  const [nextDrawTime, setNextDrawTime] = useState(45);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const minBet = 10;
  const multiplier = 4;

  useEffect(() => {
    // Countdown timer for next draw
    const timer = setInterval(() => {
      setNextDrawTime(prev => {
        if (prev <= 1) {
          // Reset to 60 seconds for next draw
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNumberSelect = (number: number) => {
    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else {
        if (prev.length >= 10) {
          toast({
            title: "Maximum 10 numbers allowed",
            description: "You can select up to 10 numbers per bet.",
            variant: "destructive"
          });
          return prev;
        }
        return [...prev, number];
      }
    });
  };

  const handleNumberRemove = (number: number) => {
    setSelectedNumbers(prev => prev.filter(n => n !== number));
  };

  const handleClearAll = () => {
    setSelectedNumbers([]);
  };

  const handlePlaceBet = (betAmount: number, numbers: number[]) => {
    const totalBet = betAmount * numbers.length;
    
    // Update balance
    setUserBalance(prev => prev - totalBet);
    
    // Clear selections
    setSelectedNumbers([]);
    
    toast({
      title: "Bet placed successfully! 🎯",
      description: `₹${totalBet.toLocaleString()} bet on ${numbers.length} numbers. Draw in ${nextDrawTime}s`,
      duration: 4000,
    });

    // Simulate confetti or celebration
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
        <Card className="bg-black/40 backdrop-blur-xl border-gray-700/50 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-400 mb-6">Please login to start playing MATKA 100</p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          >
            Login / Sign Up
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/50 backdrop-blur-xl border-b border-gray-700/50 p-4 sticky top-0 z-40"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">MATKA 100</h1>
              <p className="text-sm text-gray-400">Pick your lucky numbers</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-400">Balance</p>
            <p className="text-lg font-bold text-green-400">₹{userBalance.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Game Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-4 mb-6"
      >
        <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Game Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-white font-bold">Next Draw: {nextDrawTime}s</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Game Content */}
      <div className="px-4 space-y-6">
        {/* Number Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <EnhancedNumberBoard
            onNumberSelect={handleNumberSelect}
            selectedNumbers={selectedNumbers}
            minBet={minBet}
            multiplier={multiplier}
          />
        </motion.div>

        {/* Betting Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BettingPanel
            selectedNumbers={selectedNumbers}
            onNumberRemove={handleNumberRemove}
            onClearAll={handleClearAll}
            onPlaceBet={handlePlaceBet}
            userBalance={userBalance}
            minBet={minBet}
            multiplier={multiplier}
          />
        </motion.div>
      </div>

      {/* Game Rules Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mx-4 mt-6 mb-8"
      >
        <Card className="bg-black/20 backdrop-blur-xl border-gray-700/50 p-4">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            How to Play
          </h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Select numbers from 0-100</p>
            <p>• Minimum bet: ₹{minBet} per number</p>
            <p>• Win {multiplier}x your bet amount</p>
            <p>• Draw every minute</p>
            <p>• Maximum 10 numbers per bet</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default MobileGamePage;

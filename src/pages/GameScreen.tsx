
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { EnhancedNumberPad } from '../components/EnhancedNumberPad';
import { BetCart } from '../components/BetCart';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { useParams } from 'react-router-dom';

const GameScreen = () => {
  const { gameId } = useParams();
  const [walletBalance] = useState(15750);
  const [cartKey, setCartKey] = useState(0);
  const { toast } = useToast();

  const handleCartUpdate = () => {
    setCartKey(prev => prev + 1);
  };

  const handleBetPlaced = () => {
    toast({
      title: "Bets Placed Successfully! 🎯",
      description: "Good luck with your bets!",
      duration: 3000,
    });
    setCartKey(prev => prev + 1);
  };

  if (!gameId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Game not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header - Clean Design */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card border-b border-gray-700/50 p-4 mb-6"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Play Game</h1>
                <p className="text-sm text-gray-400">Select numbers and place your bets</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-400">Wallet Balance</p>
            <p className="text-xl font-bold text-green-400">₹{walletBalance.toLocaleString()}</p>
          </div>
        </div>
      </motion.header>

      {/* Game Content - Enhanced Layout */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Number Pad - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="glass-card border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Select Your Numbers</h2>
              <EnhancedNumberPad 
                gameId={gameId} 
                onCartUpdate={handleCartUpdate}
              />
            </div>
          </div>

          {/* Bet Cart - Takes 1 column */}
          <div className="lg:col-span-1">
            <BetCart 
              key={cartKey}
              gameId={gameId} 
              onBetPlaced={handleBetPlaced}
            />
          </div>
        </div>
      </div>

      {/* Bottom Padding for Mobile Navigation */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default GameScreen;

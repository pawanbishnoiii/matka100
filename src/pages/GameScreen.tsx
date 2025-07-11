
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import NumberPad from '../components/NumberPad';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

const GameScreen = () => {
  const [walletBalance] = useState(15750);
  const { toast } = useToast();

  const handleBetPlace = (number: number, amount: number) => {
    toast({
      title: "Bet Placed Successfully! 🎯",
      description: `You bet ₹${amount} on number ${number}. Good luck!`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
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
                <h1 className="text-2xl font-bold text-white hindi-font">Play Game</h1>
                <p className="text-sm text-gray-400">Choose your lucky number</p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-400">Wallet Balance</p>
            <p className="text-xl font-bold text-green-400">₹{walletBalance.toLocaleString()}</p>
          </div>
        </div>
      </motion.header>

      {/* Game Content */}
      <div className="container mx-auto">
        <NumberPad onBetPlace={handleBetPlace} walletBalance={walletBalance} />
      </div>

      {/* Bottom Padding for Mobile Navigation */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default GameScreen;

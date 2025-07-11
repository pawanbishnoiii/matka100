
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, DollarSign } from 'lucide-react';

interface Winner {
  name: string;
  game: string;
  amount: string;
  time: string;
}

export const LiveWinnerTicker = () => {
  const [currentWinner, setCurrentWinner] = useState(0);
  
  const winners: Winner[] = [
    { name: "Raj***", game: "Kalyan Matka", amount: "₹15,000", time: "2 min ago" },
    { name: "Pri***", game: "Mumbai Matka", amount: "₹8,500", time: "5 min ago" },
    { name: "Ami***", game: "Delhi Bazaar", amount: "₹22,000", time: "8 min ago" },
    { name: "Vik***", game: "Rajdhani Day", amount: "₹12,000", time: "12 min ago" },
    { name: "Sun***", game: "Kalyan Matka", amount: "₹18,750", time: "15 min ago" },
    { name: "Kri***", game: "Mumbai Matka", amount: "₹9,200", time: "18 min ago" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWinner((prev) => (prev + 1) % winners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [winners.length]);

  return (
    <section className="py-8 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-y border-green-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-yellow-400"
            >
              <Trophy className="w-8 h-8" />
            </motion.div>
            
            <div className="text-white">
              <h3 className="text-lg font-bold mb-2">🎉 Live Winners</h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWinner}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="glass-card px-6 py-3 rounded-full bg-gradient-to-r from-green-600/20 to-emerald-600/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="font-bold">{winners[currentWinner].name}</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      won <span className="text-green-400 font-bold">{winners[currentWinner].amount}</span> in {winners[currentWinner].game}
                    </div>
                    <div className="text-xs text-gray-400">
                      {winners[currentWinner].time}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

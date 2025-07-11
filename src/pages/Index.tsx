
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Trophy, Users, TrendingUp, Crown, Zap } from 'lucide-react';
import GamesList from '../components/GamesList';
import { Button } from '../components/ui/button';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card border-b border-gray-700/50 p-4"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent hindi-font">
                Matka100
              </h1>
              <p className="text-xs text-gray-400">Trusted Gaming Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Current Time</p>
              <p className="font-mono text-green-400">
                {currentTime.toLocaleTimeString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  hour12: true
                })}
              </p>
            </div>
            <Button className="neon-glow bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
              Login
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4 hindi-font"
          >
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Welcome to Matka100
            </span>
          </motion.h2>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-6 hindi-font"
          >
            India's Most Trusted Matka Gaming Platform
          </motion.p>
          
          {/* Stats Row */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: Users, label: 'Active Players', value: '10,000+', color: 'text-blue-400' },
              { icon: Trophy, label: 'Daily Winners', value: '500+', color: 'text-yellow-400' },
              { icon: Coins, label: 'Daily Payout', value: '₹50L+', color: 'text-green-400' },
              { icon: TrendingUp, label: 'Win Rate', value: '95%+', color: 'text-red-400' }
            ].map((stat, index) => (
              <div key={index} className="glass-card p-4 rounded-xl">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Games Section */}
      <motion.section 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="container mx-auto px-4 pb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2 hindi-font">
            <Zap className="w-6 h-6 text-yellow-400" />
            Live Games
            <span className="text-sm bg-red-600 text-white px-2 py-1 rounded-full ml-2 animate-pulse">
              LIVE
            </span>
          </h3>
        </div>
        
        <GamesList />
      </motion.section>

      {/* Features Banner */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="glass-card rounded-2xl p-6 neon-blue-glow">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2 hindi-font">Instant Withdrawal</h4>
              <p className="text-gray-400">Get your winnings instantly to UPI/Bank</p>
            </div>
            
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2 hindi-font">Best Rates</h4>
              <p className="text-gray-400">Highest payout rates in the market</p>
            </div>
            
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2 hindi-font">24/7 Support</h4>
              <p className="text-gray-400">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="glass-card border-t border-gray-700/50 mt-8 p-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 mb-2">© 2024 Matka100. All rights reserved.</p>
          <p className="text-sm text-gray-500">Play Responsibly. 18+ Only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

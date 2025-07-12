
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Target, DollarSign } from 'lucide-react';
import { AvatarCircles } from '@/components/ui/avatar-circles';

interface LiveStats {
  players: number;
  volume: number;
  totalBets: number;
  winners: number;
}

const LiveStatistics = () => {
  const [stats, setStats] = useState<LiveStats>({
    players: 1000,
    volume: 7000,
    totalBets: 5000,
    winners: 127
  });

  const [isAnimating, setIsAnimating] = useState(false);

  // Avatar URLs for live players
  const avatarUrls = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612c98b?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setStats(prev => ({
        players: Math.floor(Math.random() * (173000 - 1000) + 1000),
        volume: Math.floor(Math.random() * (9700000 - 7000) + 7000),
        totalBets: Math.floor(Math.random() * (50000 - 5000) + 5000),
        winners: Math.floor(Math.random() * (1500 - 100) + 100)
      }));

      setTimeout(() => setIsAnimating(false), 500);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Live Players */}
      <motion.div
        className="glass-card p-4 rounded-xl border border-blue-500/30"
        animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Live Players</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-green-400">LIVE</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <motion.p 
            className="text-2xl font-bold text-white"
            key={stats.players}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatNumber(stats.players)}
          </motion.p>
          <AvatarCircles 
            avatarUrls={avatarUrls} 
            numPeople={Math.floor(stats.players / 1000)}
            className="scale-75"
          />
        </div>
      </motion.div>

      {/* Live Volume */}
      <motion.div
        className="glass-card p-4 rounded-xl border border-green-500/30"
        animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Live Volume</span>
          </div>
          <TrendingUp className="w-4 h-4 text-green-400" />
        </div>
        <motion.p 
          className="text-2xl font-bold text-green-400"
          key={stats.volume}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          ₹{formatNumber(stats.volume)}
        </motion.p>
      </motion.div>

      {/* Total Bets */}
      <motion.div
        className="glass-card p-4 rounded-xl border border-purple-500/30"
        animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-purple-400" />
          <span className="text-sm text-gray-400">Total Bets</span>
        </div>
        <motion.p 
          className="text-2xl font-bold text-purple-400"
          key={stats.totalBets}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formatNumber(stats.totalBets)}
        </motion.p>
      </motion.div>

      {/* Winners Today */}
      <motion.div
        className="glass-card p-4 rounded-xl border border-yellow-500/30"
        animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 text-yellow-400">🏆</div>
          <span className="text-sm text-gray-400">Winners Today</span>
        </div>
        <motion.p 
          className="text-2xl font-bold text-yellow-400"
          key={stats.winners}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {stats.winners}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LiveStatistics;

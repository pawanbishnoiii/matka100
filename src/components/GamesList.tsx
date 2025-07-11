
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, TrendingUp, Trophy, Zap } from 'lucide-react';
import { Button } from './ui/button';

interface Game {
  id: string;
  name: string;
  timing: string;
  types: string[];
  payouts: {
    [key: string]: number;
  };
  status: 'open' | 'closed' | 'result';
  isLive: boolean;
}

const GamesList = () => {
  const [games] = useState<Game[]>([
    {
      id: 'desawar',
      name: 'Desawar',
      timing: '04:30 AM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'gali',
      name: 'Gali',
      timing: '11:00 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'faridabad',
      name: 'Faridabad',
      timing: '06:15 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'ghaziabad',
      name: 'Ghaziabad',
      timing: '08:00 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'shri-ganesh',
      name: 'Shri Ganesh',
      timing: '05:30 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'rajdhani-day',
      name: 'Rajdhani Day',
      timing: '03:00 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'rajdhani-night',
      name: 'Rajdhani Night',
      timing: '09:00 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'kalyan',
      name: 'Kalyan',
      timing: '03:45 PM - 05:45 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'mumbai-day',
      name: 'Mumbai Day',
      timing: '01:00 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'mumbai-night',
      name: 'Mumbai Night',
      timing: '09:30 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'main-bazar',
      name: 'Main Bazar',
      timing: '09:00 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'milan-day',
      name: 'Milan Day',
      timing: '02:30 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    },
    {
      id: 'milan-night',
      name: 'Milan Night',
      timing: '08:30 PM',
      types: ['Single Ank', 'Jodi', 'Patti'],
      payouts: {
        'Single Ank': 10,
        'Jodi': 90,
        'Single Patti': 140,
        'Double Patti': 280,
        'Triple Patti': 600
      },
      status: 'open',
      isLive: true
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeUntilGame = (timing: string) => {
    // Simple countdown logic - in real app this would be more sophisticated
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;
    
    // Convert game timing to minutes (simplified)
    const gameTime = timing.includes('PM') ? 
      (parseInt(timing.split(':')[0]) % 12 + 12) * 60 + parseInt(timing.split(':')[1]) :
      parseInt(timing.split(':')[0]) * 60 + parseInt(timing.split(':')[1]);
    
    const diff = gameTime - currentMinutes;
    const hoursLeft = Math.floor(Math.abs(diff) / 60);
    const minutesLeft = Math.abs(diff) % 60;
    
    return `${hoursLeft}h ${minutesLeft}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game, index) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 relative overflow-hidden"
        >
          {/* Live Badge */}
          {game.isLive && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              LIVE
            </div>
          )}

          {/* Game Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 hindi-font flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              {game.name}
            </h3>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{game.timing}</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="mb-4 p-3 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg border border-red-500/30">
            <p className="text-sm text-gray-300 mb-1">Next Result In:</p>
            <p className="text-lg font-bold text-red-400 font-mono countdown-timer px-2 py-1 rounded">
              {getTimeUntilGame(game.timing)}
            </p>
          </div>

          {/* Bet Types & Payouts */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Bet Types & Payouts:</p>
            <div className="space-y-1">
              {Object.entries(game.payouts).map(([type, payout]) => (
                <div key={type} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{type}</span>
                  <span className="text-green-400 font-bold">₹{payout}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Play Button */}
          <Button 
            className="w-full neon-glow bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-xl pulse-glow"
          >
            <Play className="w-5 h-5 mr-2" />
            Play Now
            <Zap className="w-4 h-4 ml-2 text-yellow-300" />
          </Button>

          {/* Background Decoration */}
          <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-red-500/10 rounded-full"></div>
        </motion.div>
      ))}
    </div>
  );
};

export default GamesList;

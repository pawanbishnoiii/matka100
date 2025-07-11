
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, Zap, TrendingUp, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Game {
  id: string;
  name: string;
  opening_time: string;
  result_time: string;
  status: 'active' | 'closed' | 'upcoming';
  multipliers: {
    single_ank: number;
    jodi: number;
    single_patti: number;
    double_patti: number;
    triple_patti: number;
  };
  next_result: string;
  popularity: number;
}

const sampleGames: Game[] = [
  {
    id: '1',
    name: 'Kalyan Matka',
    opening_time: '15:30',
    result_time: '17:30',
    status: 'active',
    multipliers: {
      single_ank: 10,
      jodi: 90,
      single_patti: 140,
      double_patti: 280,
      triple_patti: 600
    },
    next_result: '17:30',
    popularity: 95
  },
  {
    id: '2',
    name: 'Mumbai Matka',
    opening_time: '16:00',
    result_time: '18:00',
    status: 'active',
    multipliers: {
      single_ank: 10,
      jodi: 95,
      single_patti: 150,
      double_patti: 300,
      triple_patti: 650
    },
    next_result: '18:00',
    popularity: 88
  },
  {
    id: '3',
    name: 'Delhi Bazaar',
    opening_time: '17:00',
    result_time: '19:00',
    status: 'upcoming',
    multipliers: {
      single_ank: 9,
      jodi: 85,
      single_patti: 135,
      double_patti: 270,
      triple_patti: 580
    },
    next_result: '19:00',
    popularity: 82
  },
  {
    id: '4',
    name: 'Rajdhani Day',
    opening_time: '14:00',
    result_time: '16:00',
    status: 'closed',
    multipliers: {
      single_ank: 10,
      jodi: 90,
      single_patti: 140,
      double_patti: 280,
      triple_patti: 600
    },
    next_result: '16:00',
    popularity: 90
  }
];

export const PremiumGameShowcase = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeUntilResult = (resultTime: string) => {
    const now = new Date();
    const [hours, minutes] = resultTime.split(':').map(Number);
    const result = new Date(now);
    result.setHours(hours, minutes, 0, 0);
    
    if (result < now) {
      result.setDate(result.getDate() + 1);
    }
    
    const diff = result.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'upcoming': return 'text-blue-400 bg-blue-400/20';
      case 'closed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getBetTypes = (game: Game) => [
    { name: 'Single Ank', multiplier: game.multipliers.single_ank, description: 'Single digit (0-9)' },
    { name: 'Jodi', multiplier: game.multipliers.jodi, description: 'Two digit combo' },
    { name: 'Single Patti', multiplier: game.multipliers.single_patti, description: 'Three digit single' },
    { name: 'Double Patti', multiplier: game.multipliers.double_patti, description: 'Three digit double' },
    { name: 'Triple Patti', multiplier: game.multipliers.triple_patti, description: 'Three digit triple' }
  ];

  return (
    <div className="space-y-8">
      {/* Games Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Card className="glass-card-premium hover-lift cursor-pointer border-gray-700/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {game.name}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(game.status)}`}>
                    {game.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">
                      {game.opening_time} - {game.result_time}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <Target className="w-4 h-4 text-red-400" />
                    <span className="text-sm">
                      Next Result: {getTimeUntilResult(game.result_time)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-300">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm">
                      Popularity: {game.popularity}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Max Payout</p>
                      <p className="text-lg font-bold text-yellow-400">
                        {game.multipliers.triple_patti}x
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedGame(game)}
                      disabled={game.status === 'closed'}
                      className="gradient-matka text-white hover:scale-105 transition-transform"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Play Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bet Types Preview */}
      {selectedGame && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card-premium rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              {selectedGame.name} - Bet Types
            </h3>
            <Button
              onClick={() => setSelectedGame(null)}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              Close
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {getBetTypes(selectedGame).map((betType, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 rounded-lg text-center hover-lift"
              >
                <h4 className="font-bold text-white mb-2">{betType.name}</h4>
                <p className="text-2xl font-bold text-yellow-400 mb-1">
                  {betType.multiplier}x
                </p>
                <p className="text-xs text-gray-400">{betType.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button className="gradient-matka text-white px-8 py-3 text-lg hover:scale-105 transition-transform neon-glow">
              <Zap className="w-5 h-5 mr-2" />
              Start Betting on {selectedGame.name}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

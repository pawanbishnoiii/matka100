
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, TrendingUp, Play, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Game {
  id: string;
  name: string;
  opening_time: string;
  result_time: string;
  status: string;
  multipliers: any;
}

export const GameShowcase = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchGames();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('opening_time', { ascending: true });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGameStatus = (game: Game) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const openingTime = new Date(`${today}T${game.opening_time}`);
    const resultTime = new Date(`${today}T${game.result_time}`);

    if (now < openingTime) {
      return { status: 'upcoming', color: 'bg-blue-500/20 text-blue-400', label: 'Upcoming' };
    } else if (now >= openingTime && now < resultTime) {
      return { status: 'open', color: 'bg-green-500/20 text-green-400', label: 'Open' };
    } else {
      return { status: 'closed', color: 'bg-red-500/20 text-red-400', label: 'Closed' };
    }
  };

  const getTimeUntilNext = (game: Game) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const openingTime = new Date(`${today}T${game.opening_time}`);
    const resultTime = new Date(`${today}T${game.result_time}`);

    let targetTime = openingTime;
    if (now >= openingTime && now < resultTime) {
      targetTime = resultTime;
    } else if (now >= resultTime) {
      targetTime = new Date(openingTime.getTime() + 24 * 60 * 60 * 1000);
    }

    const diff = targetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getMaxPayout = (multipliers: any) => {
    if (!multipliers) return 0;
    return Math.max(...Object.values(multipliers).map(v => Number(v)));
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="loading-shimmer h-12 w-64 mx-auto mb-4 rounded-lg"></div>
            <div className="loading-shimmer h-6 w-96 mx-auto rounded-lg"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="loading-shimmer h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-black/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold heading-premium mb-6">
            Live Games
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Choose from <span className="text-gradient font-semibold">{games.length}+ premium games</span> with 
            <span className="text-accent-gradient font-semibold"> real-time updates</span> and 
            <span className="text-gradient font-semibold"> guaranteed payouts</span>
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game, index) => {
            const gameStatus = getGameStatus(game);
            const timeUntilNext = getTimeUntilNext(game);
            const maxPayout = getMaxPayout(game.multipliers);

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="premium-card h-full overflow-hidden">
                  <CardContent className="p-6">
                    {/* Game Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{game.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Calendar className="w-4 h-4" />
                          <span>{game.opening_time} - {game.result_time}</span>
                        </div>
                      </div>
                      <Badge className={`${gameStatus.color} border-0 font-semibold`}>
                        {gameStatus.label}
                      </Badge>
                    </div>

                    {/* Countdown Timer */}
                    <div className="mb-4 p-3 bg-black/20 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-white/70">
                          {gameStatus.status === 'open' ? 'Result in' : 'Opens in'}
                        </span>
                      </div>
                      <div className="text-2xl font-mono font-bold text-gradient">
                        {timeUntilNext}
                      </div>
                    </div>

                    {/* Payout Info */}
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white/60">Max Payout</div>
                        <div className="text-lg font-bold text-accent-gradient">
                          {maxPayout}x
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white/60">Min Bet</div>
                        <div className="text-lg font-bold text-green-400">
                          ₹10
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                        disabled={gameStatus.status === 'closed'}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Popular Indicator */}
                    {index < 3 && (
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-semibold">
                          <Star className="w-3 h-3" />
                          Popular
                        </div>
                      </div>
                    )}

                    {/* Trending Indicator */}
                    {gameStatus.status === 'open' && (
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold pulse-glow">
                          <TrendingUp className="w-3 h-3" />
                          Live
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* View All Games Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" className="btn-premium text-lg px-8 py-4">
            View All Games
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

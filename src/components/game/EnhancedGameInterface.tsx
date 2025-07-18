import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy, Zap, Target, Users, DollarSign, BarChart3, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import EnhancedNumberBoard from './EnhancedNumberBoard';
import BettingPanel from './BettingPanel';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Game {
  id: string;
  name: string;
  opening_time: string;
  result_time: string;
  status: string;
  multipliers: any;
  is_active: boolean;
}

interface GameStats {
  total_bets: number;
  total_amount: number;
  active_players: number;
  last_result: number | null;
  time_remaining: number;
}

interface EnhancedGameInterfaceProps {
  gameId: string;
}

const EnhancedGameInterface: React.FC<EnhancedGameInterfaceProps> = ({ gameId }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [gameStatus, setGameStatus] = useState<'upcoming' | 'open' | 'closed'>('upcoming');
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (gameId) {
      fetchGameData();
      fetchUserBalance();
      const interval = setInterval(updateTimeRemaining, 1000);
      return () => clearInterval(interval);
    }
  }, [gameId]);

  useEffect(() => {
    if (game) {
      const interval = setInterval(fetchGameStats, 10000); // Update stats every 10 seconds
      return () => clearInterval(interval);
    }
  }, [game]);

  const fetchGameData = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (error) throw error;
      setGame(data);
      fetchGameStats();
    } catch (error) {
      console.error('Error fetching game:', error);
      toast({
        title: 'Error',
        description: 'Failed to load game data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGameStats = async () => {
    try {
      const { data: betsData } = await supabase
        .from('bets')
        .select('amount_inr, user_id')
        .eq('game_id', gameId)
        .eq('bet_date', new Date().toISOString().split('T')[0]);

      const { data: resultData } = await supabase
        .from('results')
        .select('winning_number')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
        .limit(1);

      const totalBets = betsData?.length || 0;
      const totalAmount = betsData?.reduce((sum, bet) => sum + Number(bet.amount_inr), 0) || 0;
      const activePlayers = new Set(betsData?.map(bet => bet.user_id)).size;
      const lastResult = resultData?.[0]?.winning_number || null;

      setGameStats({
        total_bets: totalBets,
        total_amount: totalAmount,
        active_players: activePlayers,
        last_result: lastResult,
        time_remaining: timeRemaining
      });
    } catch (error) {
      console.error('Error fetching game stats:', error);
    }
  };

  const fetchUserBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('balance_inr')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserBalance(data.balance_inr || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const updateTimeRemaining = () => {
    if (!game) return;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const openingTime = game.opening_time;
    const resultTime = game.result_time;

    if (currentTime < openingTime) {
      setGameStatus('upcoming');
      const openingDateTime = new Date(`${now.toDateString()} ${openingTime}`);
      setTimeRemaining(Math.max(0, openingDateTime.getTime() - now.getTime()));
    } else if (currentTime >= openingTime && currentTime < resultTime) {
      setGameStatus('open');
      const resultDateTime = new Date(`${now.toDateString()} ${resultTime}`);
      setTimeRemaining(Math.max(0, resultDateTime.getTime() - now.getTime()));
    } else {
      setGameStatus('closed');
      setTimeRemaining(0);
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleNumberSelect = (number: number) => {
    setSelectedNumbers(prev => 
      prev.includes(number) 
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  const handleNumberRemove = (number: number) => {
    setSelectedNumbers(prev => prev.filter(n => n !== number));
  };

  const handleClearAll = () => {
    setSelectedNumbers([]);
  };

  const handlePlaceBet = async (amount: number, numbers: number[]) => {
    if (!user || !game) return;

    try {
      const bets = numbers.map(number => ({
        user_id: user.id,
        game_id: gameId,
        numbers: [number],
        amount_inr: amount,
        bet_type: 'single_ank' as const,
        potential_win: amount * (game.multipliers?.single_ank || 10),
        bet_date: new Date().toISOString().split('T')[0]
      }));

      const { error } = await supabase
        .from('bets')
        .insert(bets);

      if (error) throw error;

      // Update user balance
      const totalAmount = amount * numbers.length;
      await supabase.rpc('update_user_balance', {
        user_uuid: user.id,
        amount: -totalAmount,
        currency: 'INR'
      });

      toast({
        title: 'Bet Placed Successfully!',
        description: `Placed ${numbers.length} bets of ₹${amount} each`,
      });

      setSelectedNumbers([]);
      fetchUserBalance();
      fetchGameStats();
    } catch (error) {
      console.error('Error placing bet:', error);
      toast({
        title: 'Error',
        description: 'Failed to place bet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gaming-dark to-black flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading game...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gaming-dark to-black flex items-center justify-center">
        <Card className="bg-gaming-card border-gaming-border">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Game Not Found</h2>
            <p className="text-gaming-text-secondary">The requested game could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark to-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Game Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-gaming-accent" />
            <h1 className="text-4xl font-bold text-white">{game.name}</h1>
          </div>
          
          {/* Game Status & Timer */}
          <div className="flex items-center justify-center gap-6">
            <Badge 
              className={`text-lg px-4 py-2 ${
                gameStatus === 'open' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                gameStatus === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                'bg-red-500/20 text-red-400 border-red-500/30'
              }`}
            >
              {gameStatus === 'open' ? '🟢 BETTING OPEN' : 
               gameStatus === 'upcoming' ? '🔵 OPENING SOON' : 
               '🔴 BETTING CLOSED'}
            </Badge>
            
            {timeRemaining > 0 && (
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-gaming-primary" />
                <span className="text-xl font-mono font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Game Stats */}
        {gameStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{gameStats.active_players}</div>
                <div className="text-sm text-gaming-text-secondary">Active Players</div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{gameStats.total_bets}</div>
                <div className="text-sm text-gaming-text-secondary">Total Bets</div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">₹{gameStats.total_amount.toLocaleString()}</div>
                <div className="text-sm text-gaming-text-secondary">Total Volume</div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-6 h-6 text-gaming-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {gameStats.last_result !== null ? gameStats.last_result : '--'}
                </div>
                <div className="text-sm text-gaming-text-secondary">Last Result</div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Game Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Number Board */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <EnhancedNumberBoard
                onNumberSelect={handleNumberSelect}
                selectedNumbers={selectedNumbers}
                minBet={10}
                multiplier={game.multipliers?.single_ank || 10}
              />
            </motion.div>
          </div>

          {/* Betting Panel */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <BettingPanel
                selectedNumbers={selectedNumbers}
                onNumberRemove={handleNumberRemove}
                onClearAll={handleClearAll}
                onPlaceBet={handlePlaceBet}
                userBalance={userBalance}
                minBet={10}
                multiplier={game.multipliers?.single_ank || 10}
              />
            </motion.div>
          </div>
        </div>

        {/* Game Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gaming-card border-gaming-border">
            <CardHeader>
              <CardTitle className="text-white">Game Rules & Multipliers</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-gaming-darker/50 rounded-lg">
                <div className="text-gaming-text-secondary text-sm">Single Ank</div>
                <div className="text-white font-bold">{game.multipliers?.single_ank || 10}x</div>
              </div>
              <div className="text-center p-3 bg-gaming-darker/50 rounded-lg">
                <div className="text-gaming-text-secondary text-sm">Jodi</div>
                <div className="text-white font-bold">{game.multipliers?.jodi || 90}x</div>
              </div>
              <div className="text-center p-3 bg-gaming-darker/50 rounded-lg">
                <div className="text-gaming-text-secondary text-sm">Single Patti</div>
                <div className="text-white font-bold">{game.multipliers?.single_patti || 140}x</div>
              </div>
              <div className="text-center p-3 bg-gaming-darker/50 rounded-lg">
                <div className="text-gaming-text-secondary text-sm">Double Patti</div>
                <div className="text-white font-bold">{game.multipliers?.double_patti || 280}x</div>
              </div>
              <div className="text-center p-3 bg-gaming-darker/50 rounded-lg">
                <div className="text-gaming-text-secondary text-sm">Triple Patti</div>
                <div className="text-white font-bold">{game.multipliers?.triple_patti || 600}x</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedGameInterface;
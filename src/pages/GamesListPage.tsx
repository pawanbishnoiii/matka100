
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  ArrowLeft,
  Play,
  BarChart3
} from 'lucide-react';

interface Game {
  id: string;
  name: string;
  opening_time: string;
  result_time: string;
  status: string;
  multipliers: any;
  is_active: boolean;
  created_at: string;
}

interface GameStats {
  total_bets: number;
  total_amount: number;
  active_players: number;
  last_result: number | null;
}

const GamesListPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [gameStats, setGameStats] = useState<Record<string, GameStats>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('opening_time');

      if (gamesError) throw gamesError;

      setGames(gamesData || []);

      // Fetch stats for each game
      const statsPromises = (gamesData || []).map(async (game) => {
        const { data: betsData } = await supabase
          .from('bets')
          .select('amount_inr, user_id')
          .eq('game_id', game.id)
          .eq('bet_date', new Date().toISOString().split('T')[0]);

        const { data: resultData } = await supabase
          .from('results')
          .select('winning_number')
          .eq('game_id', game.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const totalBets = betsData?.length || 0;
        const totalAmount = betsData?.reduce((sum, bet) => sum + Number(bet.amount_inr), 0) || 0;
        const activePlayers = new Set(betsData?.map(bet => bet.user_id)).size;
        const lastResult = resultData?.[0]?.winning_number || null;

        return {
          gameId: game.id,
          stats: {
            total_bets: totalBets,
            total_amount: totalAmount,
            active_players: activePlayers,
            last_result: lastResult
          }
        };
      });

      const statsResults = await Promise.all(statsPromises);
      const statsMap = statsResults.reduce((acc, { gameId, stats }) => {
        acc[gameId] = stats;
        return acc;
      }, {} as Record<string, GameStats>);

      setGameStats(statsMap);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch games',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getGameStatus = (game: Game) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    if (currentTime < game.opening_time) {
      return { status: 'upcoming', color: 'bg-blue-500' };
    } else if (currentTime >= game.opening_time && currentTime < game.result_time) {
      return { status: 'open', color: 'bg-green-500' };
    } else {
      return { status: 'closed', color: 'bg-red-500' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading games...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-white hindi-font">
                🎯 Game Bazaar
              </h1>
              <p className="text-gray-400 mt-2">Choose your game and start winning!</p>
            </div>
          </div>
          
          {user && (
            <div className="text-right">
              <p className="text-gray-400 text-sm">Welcome back!</p>
              <p className="text-white font-semibold">{user.email}</p>
            </div>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => {
            const stats = gameStats[game.id] || {
              total_bets: 0,
              total_amount: 0,
              active_players: 0,
              last_result: null
            };
            const gameStatus = getGameStatus(game);

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-gray-700 hover:border-green-500/50 transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white hindi-font flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        {game.name}
                      </CardTitle>
                      <Badge className={`${gameStatus.color} text-white`}>
                        {gameStatus.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Timing Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs">OPEN</span>
                        </div>
                        <p className="text-white font-bold">{formatTime(game.opening_time)}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                          <Target className="w-4 h-4" />
                          <span className="text-xs">RESULT</span>
                        </div>
                        <p className="text-white font-bold">{formatTime(game.result_time)}</p>
                      </div>
                    </div>

                    {/* Game Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center py-3 bg-gray-800/30 rounded-lg">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                          <Users className="w-3 h-3" />
                        </div>
                        <p className="text-white text-sm font-semibold">{stats.active_players}</p>
                        <p className="text-gray-400 text-xs">Players</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                          <DollarSign className="w-3 h-3" />
                        </div>
                        <p className="text-white text-sm font-semibold">₹{stats.total_amount.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">Volume</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                          <TrendingUp className="w-3 h-3" />
                        </div>
                        <p className="text-white text-sm font-semibold">{stats.total_bets}</p>
                        <p className="text-gray-400 text-xs">Bets</p>
                      </div>
                    </div>

                    {/* Last Result */}
                    {stats.last_result !== null && (
                      <div className="text-center p-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
                        <p className="text-gray-400 text-xs mb-1">LAST RESULT</p>
                        <p className="text-yellow-400 text-2xl font-bold">{stats.last_result}</p>
                      </div>
                    )}

                    {/* Multipliers */}
                    <div className="grid grid-cols-5 gap-1 text-xs">
                      <div className="text-center">
                        <p className="text-gray-400">Single</p>
                        <p className="text-white font-bold">{game.multipliers?.single_ank || 10}x</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">Jodi</p>
                        <p className="text-white font-bold">{game.multipliers?.jodi || 90}x</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">SP</p>
                        <p className="text-white font-bold">{game.multipliers?.single_patti || 140}x</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">DP</p>
                        <p className="text-white font-bold">{game.multipliers?.double_patti || 280}x</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">TP</p>
                        <p className="text-white font-bold">{game.multipliers?.triple_patti || 600}x</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Link to={`/game/${game.id}`} className="flex-1">
                        <Button 
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white group-hover:scale-105 transition-transform"
                          disabled={gameStatus.status === 'closed'}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {gameStatus.status === 'closed' ? 'Closed' : 'Play Now'}
                        </Button>
                      </Link>
                      <Link to={`/game/${game.id}/charts`}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-600 text-white hover:bg-gray-700"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {games.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Games</h3>
            <p className="text-gray-400">Check back later for new games!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesListPage;

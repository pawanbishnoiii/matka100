import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Filter, TrendingUp, BarChart3, Trophy, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Result {
  id: string;
  game_id: string;
  result_date: string;
  winning_number: number;
  declared_at: string;
  total_bets: number;
  total_amount: number;
  total_payout: number;
  games: {
    name: string;
  };
}

interface GameStats {
  total_games: number;
  total_wins: number;
  total_amount_won: number;
  win_percentage: number;
}

const EnhancedResultsScreen = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedGame, setSelectedGame] = useState('all');
  const [games, setGames] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
    fetchGames();
    fetchUserStats();
  }, [selectedPeriod, selectedGame]);

  const fetchResults = async () => {
    try {
      let query = supabase
        .from('results')
        .select(`
          *,
          games (name)
        `)
        .order('declared_at', { ascending: false });

      if (selectedGame !== 'all') {
        query = query.eq('game_id', selectedGame);
      }

      // Filter by period
      const now = new Date();
      let startDate = new Date();
      
      switch (selectedPeriod) {
        case 'daily':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'weekly':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'yearly':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      query = query.gte('declared_at', startDate.toISOString());

      const { data, error } = await query.limit(50);
      if (error) throw error;

      setResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch results',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('id, name')
        .eq('is_active', true);

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const { data: bets, error } = await supabase
        .from('bets')
        .select('id, is_winner, actual_win, amount_inr')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalGames = bets?.length || 0;
      const totalWins = bets?.filter(bet => bet.is_winner).length || 0;
      const totalAmountWon = bets?.reduce((sum, bet) => sum + (bet.actual_win || 0), 0) || 0;
      const winPercentage = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;

      setGameStats({
        total_games: totalGames,
        total_wins: totalWins,
        total_amount_won: totalAmountWon,
        win_percentage: winPercentage
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const downloadResults = () => {
    const csvContent = [
      ['Date', 'Game', 'Winning Number', 'Total Bets', 'Total Amount', 'Total Payout'],
      ...results.map(result => [
        new Date(result.declared_at).toLocaleDateString(),
        result.games.name,
        result.winning_number,
        result.total_bets,
        result.total_amount,
        result.total_payout
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-results-${selectedPeriod}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded',
      description: 'Results downloaded successfully',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-gaming-darker to-black flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-gaming-darker to-black p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Game Results & Analytics</h1>
            <p className="text-gaming-text-secondary">View detailed game results and performance metrics</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={downloadResults}
              variant="outline"
              className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4"
        >
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 bg-gaming-card border-gaming-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gaming-card border-gaming-border">
              <SelectItem value="daily">Last 24 Hours</SelectItem>
              <SelectItem value="weekly">Last Week</SelectItem>
              <SelectItem value="monthly">Last Month</SelectItem>
              <SelectItem value="yearly">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedGame} onValueChange={setSelectedGame}>
            <SelectTrigger className="w-48 bg-gaming-card border-gaming-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gaming-card border-gaming-border">
              <SelectItem value="all">All Games</SelectItem>
              {games.map(game => (
                <SelectItem key={game.id} value={game.id}>{game.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* User Stats */}
        {gameStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gaming-text-secondary text-sm">Total Games</p>
                    <p className="text-2xl font-bold text-white">{gameStats.total_games}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-gaming-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gaming-text-secondary text-sm">Total Wins</p>
                    <p className="text-2xl font-bold text-gaming-accent">{gameStats.total_wins}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-gaming-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gaming-text-secondary text-sm">Amount Won</p>
                    <p className="text-2xl font-bold text-green-400">₹{gameStats.total_amount_won.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gaming-text-secondary text-sm">Win Rate</p>
                    <p className="text-2xl font-bold text-blue-400">{gameStats.win_percentage.toFixed(1)}%</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4"
        >
          {results.length === 0 ? (
            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-16 h-16 text-gaming-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                <p className="text-gaming-text-secondary">No results available for the selected period and game.</p>
              </CardContent>
            </Card>
          ) : (
            results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-gaming-card border-gaming-border hover:border-gaming-accent/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="text-gaming-text-secondary text-sm">Game</p>
                        <p className="font-semibold text-white">{result.games.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-gaming-text-secondary text-sm">Date</p>
                        <p className="text-white">{new Date(result.declared_at).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-gaming-text-secondary text-sm mb-1">Winning Number</p>
                        <Badge className="bg-gradient-to-r from-gaming-primary to-gaming-accent text-black text-lg font-bold px-4 py-2">
                          {result.winning_number}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-gaming-text-secondary text-sm">Total Bets</p>
                        <p className="text-white font-semibold">{result.total_bets}</p>
                        <p className="text-gaming-text-secondary text-xs">₹{result.total_amount.toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <p className="text-gaming-text-secondary text-sm">Payout</p>
                        <p className="text-green-400 font-semibold">₹{result.total_payout.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedResultsScreen;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Filter, TrendingUp, Award, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import confetti from 'canvas-confetti';

interface Result {
  id: string;
  game: string;
  date: string;
  winningNumber: number;
  userBet?: {
    number: number;
    amount: number;
    won: boolean;
    payout?: number;
  };
}

const ResultsScreen = () => {
  const [results] = useState<Result[]>([
    {
      id: '1',
      game: 'Desawar',
      date: '2024-01-15',
      winningNumber: 67,
      userBet: {
        number: 67,
        amount: 500,
        won: true,
        payout: 5000
      }
    },
    {
      id: '2',
      game: 'Gali',
      date: '2024-01-14',
      winningNumber: 23,
      userBet: {
        number: 45,
        amount: 200,
        won: false
      }
    },
    {
      id: '3',
      game: 'Faridabad',
      date: '2024-01-13',
      winningNumber: 89,
    },
    {
      id: '4',
      game: 'Ghaziabad',
      date: '2024-01-12',
      winningNumber: 12,
      userBet: {
        number: 12,
        amount: 1000,
        won: true,
        payout: 10000
      }
    },
    {
      id: '5',
      game: 'Desawar',
      date: '2024-01-11',
      winningNumber: 56,
    },
    {
      id: '6',
      game: 'Gali',
      date: '2024-01-10',
      winningNumber: 34,
      userBet: {
        number: 22,
        amount: 300,
        won: false
      }
    },
    {
      id: '7',
      game: 'Faridabad',
      date: '2024-01-09',
      winningNumber: 78,
    }
  ]);

  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [showUserBetsOnly, setShowUserBetsOnly] = useState(false);

  const games = ['all', 'Desawar', 'Gali', 'Faridabad', 'Ghaziabad', 'Shri Ganesh', 'Rajdhani Day'];

  const filteredResults = results.filter(result => {
    if (selectedGame !== 'all' && result.game !== selectedGame) return false;
    if (showUserBetsOnly && !result.userBet) return false;
    return true;
  });

  const triggerWinAnimation = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']
    });
  };

  useEffect(() => {
    // Check for recent wins and trigger animation
    const recentWin = results.find(r => r.userBet?.won);
    if (recentWin) {
      setTimeout(triggerWinAnimation, 500);
    }
  }, []);

  const getTotalWins = () => {
    return results.filter(r => r.userBet?.won).length;
  };

  const getTotalPayout = () => {
    return results.reduce((total, r) => total + (r.userBet?.payout || 0), 0);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-4 hindi-font flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Results & History
        </h1>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card className="glass-card border-gray-700 neon-green-glow">
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{getTotalWins()}</p>
            <p className="text-gray-400">Total Wins</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-gray-700 neon-blue-glow">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">₹{getTotalPayout().toLocaleString()}</p>
            <p className="text-gray-400">Total Winnings</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-gray-700 neon-glow">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{results.length}</p>
            <p className="text-gray-400">Games Played</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white hindi-font flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-400" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Game:</label>
                <div className="flex flex-wrap gap-2">
                  {games.map((game) => (
                    <Button
                      key={game}
                      onClick={() => setSelectedGame(game)}
                      size="sm"
                      className={`${
                        selectedGame === game
                          ? 'neon-green-glow bg-gradient-to-r from-green-600 to-emerald-600'
                          : 'glass-card hover:bg-gray-700/50'
                      }`}
                    >
                      {game === 'all' ? 'All Games' : game}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm block mb-2">Show:</label>
                <Button
                  onClick={() => setShowUserBetsOnly(!showUserBetsOnly)}
                  size="sm"
                  className={`${
                    showUserBetsOnly
                      ? 'neon-blue-glow bg-gradient-to-r from-blue-600 to-cyan-600'
                      : 'glass-card hover:bg-gray-700/50'
                  }`}
                >
                  {showUserBetsOnly ? 'My Bets Only' : 'All Results'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {filteredResults.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card rounded-xl p-6 ${
              result.userBet?.won ? 'neon-green-glow winning-animation' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                  result.userBet?.won 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                    : 'bg-gradient-to-br from-gray-600 to-gray-700 text-white'
                }`}>
                  {result.winningNumber}
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white hindi-font">{result.game}</h3>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(result.date).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {result.userBet && (
                <div className="text-right">
                  <div className="mb-2">
                    <span className="text-gray-400">Your Bet: </span>
                    <span className="text-white font-bold">{result.userBet.number}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400">Amount: </span>
                    <span className="text-white">₹{result.userBet.amount}</span>
                  </div>
                  {result.userBet.won ? (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span className="text-green-400 font-bold">
                        Won ₹{result.userBet.payout?.toLocaleString()}!
                      </span>
                    </div>
                  ) : (
                    <span className="text-red-400">Lost</span>
                  )}
                </div>
              )}
            </div>

            {result.userBet?.won && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30"
              >
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold hindi-font">🎉 Congratulations! You Won! 🎉</span>
                  <Sparkles className="w-5 h-5" />
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {filteredResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No results found for selected filters.</p>
        </motion.div>
      )}
    </div>
  );
};

export default ResultsScreen;


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Trophy,
  Clock,
  Target,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  History,
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
}

interface User {
  id: string;
  balance_inr: number;
}

export const GameProfile = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [game, setGame] = useState<Game | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [betAmount, setBetAmount] = useState('');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betType, setBetType] = useState<string>('single_ank');
  const [recentResults, setRecentResults] = useState<any[]>([]);

  useEffect(() => {
    if (gameId) {
      fetchGameData();
      if (user) {
        fetchUserData();
      }
    }
  }, [gameId, user]);

  const fetchGameData = async () => {
    try {
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (gameError) throw gameError;
      setGame(gameData);

      // Fetch recent results
      const { data: resultsData } = await supabase
        .from('results')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentResults(resultsData || []);
    } catch (error) {
      console.error('Error fetching game data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch game data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, balance_inr')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const placeBet = async () => {
    if (!user || !game || !userData) {
      toast({
        title: 'Error',
        description: 'Please login to place bets',
        variant: 'destructive',
      });
      return;
    }

    if (!betAmount || selectedNumbers.length === 0) {
      toast({
        title: 'Error',
        description: 'Please enter bet amount and select numbers',
        variant: 'destructive',
      });
      return;
    }

    const amount = parseFloat(betAmount);
    if (amount > userData.balance_inr) {
      toast({
        title: 'Insufficient Balance',
        description: 'Please add money to your wallet',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Calculate potential win
      const multiplier = game.multipliers?.[betType] || 10;
      const potentialWin = amount * multiplier;

      // Place bet
      const { error: betError } = await supabase
        .from('bets')
        .insert({
          user_id: user.id,
          game_id: game.id,
          bet_type: betType,
          numbers: selectedNumbers,
          amount_inr: amount,
          potential_win: potentialWin,
        });

      if (betError) throw betError;

      // Update user balance
      const { error: balanceError } = await supabase.rpc('update_user_balance', {
        user_uuid: user.id,
        amount: -amount,
        currency: 'INR'
      });

      if (balanceError) throw balanceError;

      // Create transaction record
      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'bet',
        amount: amount,
        currency: 'INR',
        status: 'completed',
        description: `Bet placed on ${game.name}`,
        metadata: { 
          game_id: game.id,
          bet_type: betType,
          numbers: selectedNumbers
        }
      });

      toast({
        title: 'Bet Placed Successfully!',
        description: `Your bet of ₹${amount} has been placed. Potential win: ₹${potentialWin}`,
      });

      // Reset form
      setBetAmount('');
      setSelectedNumbers([]);
      fetchUserData(); // Refresh balance

    } catch (error) {
      console.error('Error placing bet:', error);
      toast({
        title: 'Error',
        description: 'Failed to place bet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleNumber = (num: number) => {
    setSelectedNumbers(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num)
        : [...prev, num]
    );
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading game...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Game Not Found</h2>
          <Button onClick={() => navigate('/games')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
        </div>
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
              onClick={() => navigate('/games')}
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-white hindi-font flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                {game.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-green-400">
                  <Clock className="w-4 h-4" />
                  <span>Opens: {formatTime(game.opening_time)}</span>
                </div>
                <div className="flex items-center gap-1 text-red-400">
                  <Target className="w-4 h-4" />
                  <span>Result: {formatTime(game.result_time)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {userData && (
            <Card className="glass-card border-gray-700">
              <CardContent className="p-4">
                <p className="text-gray-400 text-sm">Wallet Balance</p>
                <p className="text-2xl font-bold text-green-400">₹{userData.balance_inr.toLocaleString()}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Betting Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Place Your Bet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bet Type Selection */}
                <div>
                  <Label className="text-gray-300">Bet Type</Label>
                  <Select value={betType} onValueChange={setBetType}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single_ank">Single Ank ({game.multipliers?.single_ank || 10}x)</SelectItem>
                      <SelectItem value="jodi">Jodi ({game.multipliers?.jodi || 90}x)</SelectItem>
                      <SelectItem value="single_patti">Single Patti ({game.multipliers?.single_patti || 140}x)</SelectItem>
                      <SelectItem value="double_patti">Double Patti ({game.multipliers?.double_patti || 280}x)</SelectItem>
                      <SelectItem value="triple_patti">Triple Patti ({game.multipliers?.triple_patti || 600}x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Number Selection */}
                <div>
                  <Label className="text-gray-300">Select Numbers</Label>
                  <div className="grid grid-cols-10 gap-2 mt-2">
                    {Array.from({ length: 10 }, (_, i) => (
                      <Button
                        key={i}
                        variant={selectedNumbers.includes(i) ? "default" : "outline"}
                        className={`aspect-square ${
                          selectedNumbers.includes(i)
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'border-gray-600 text-white hover:bg-gray-700'
                        }`}
                        onClick={() => toggleNumber(i)}
                      >
                        {i}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Bet Amount */}
                <div>
                  <Label className="text-gray-300">Bet Amount (₹)</Label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                {/* Potential Win */}
                {betAmount && selectedNumbers.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
                    <p className="text-gray-300">Potential Win</p>
                    <p className="text-2xl font-bold text-green-400">
                      ₹{(parseFloat(betAmount) * (game.multipliers?.[betType] || 10)).toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Place Bet Button */}
                <Button
                  onClick={placeBet}
                  disabled={!user || !betAmount || selectedNumbers.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-lg py-3"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Place Bet
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Results */}
            <Card className="glass-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentResults.length > 0 ? (
                  <div className="space-y-3">
                    {recentResults.map((result, index) => (
                      <div key={result.id} className="flex justify-between items-center p-2 bg-gray-800/30 rounded">
                        <span className="text-gray-400 text-sm">
                          {new Date(result.result_date).toLocaleDateString()}
                        </span>
                        <Badge className="bg-yellow-500 text-black font-bold">
                          {result.winning_number}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">No results yet</p>
                )}
              </CardContent>
            </Card>

            {/* Charts Button */}
            <Button
              onClick={() => navigate(`/game/${gameId}/charts`)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Charts & Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

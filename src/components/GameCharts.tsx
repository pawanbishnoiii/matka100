import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar, Target, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface Game {
  id: string;
  name: string;
  opening_time: string;
  result_time: string;
  status: string;
}

interface WinningNumber {
  number: number;
  count: number;
}

const sampleWinningNumbers: WinningNumber[] = [
  { number: 5, count: 20 },
  { number: 12, count: 15 },
  { number: 27, count: 18 },
  { number: 33, count: 22 },
  { number: 48, count: 17 },
  { number: 51, count: 25 },
  { number: 64, count: 19 },
  { number: 79, count: 21 },
  { number: 85, count: 16 },
  { number: 92, count: 23 },
];

const sampleBettingTrends = [
  { time: '00:00', bets: 120 },
  { time: '03:00', bets: 150 },
  { time: '06:00', bets: 180 },
  { time: '09:00', bets: 200 },
  { time: '12:00', bets: 220 },
  { time: '15:00', bets: 250 },
  { time: '18:00', bets: 230 },
  { time: '21:00', bets: 210 },
  { time: '24:00', bets: 190 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#A8A495', '#A4A428', '#8042FF', '#84d888', '#A495A8'];

export const GameCharts = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gameId) {
      fetchGameDetails(gameId);
    }
  }, [gameId]);

  const fetchGameDetails = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching game details:', error);
        // Optionally, display an error message to the user
      } else {
        setGame(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const winningNumbersData = sampleWinningNumbers.map(item => ({
    name: item.number.toString(),
    count: item.count,
  }));

  const bettingTrendsData = sampleBettingTrends.map(item => ({
    time: item.time,
    bets: item.bets,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading charts...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Game not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card border-b border-gray-700/50 p-4 mb-6"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">{game.name} Charts</h1>
                <p className="text-sm text-gray-400">Analytics and trends for {game.name}</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">Last Updated</p>
            <p className="text-xl font-bold text-green-400">Just Now</p>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Game Info Card */}
        <Card className="glass-card border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              {game.name} Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Opening Time</p>
              <p className="text-white font-bold">{game.opening_time}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Result Time</p>
              <p className="text-white font-bold">{game.result_time}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <Badge className="bg-green-500 text-white">{game.status}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Winning Numbers Distribution */}
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Winning Numbers Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={winningNumbersData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {winningNumbersData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Betting Trends Over Time */}
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-400" />
                Betting Trends Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bettingTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bets" stroke="#E2B714" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Latest Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                  <tr>
                    <th className="py-3 px-6">Number</th>
                    <th className="py-3 px-6">Frequency</th>
                    <th className="py-3 px-6">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleWinningNumbers.map((item, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="py-4 px-6 text-white">{item.number}</td>
                      <td className="py-4 px-6 text-white">{item.count}</td>
                      <td className="py-4 px-6 text-white">Today</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

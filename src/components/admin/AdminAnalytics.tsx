
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  Trophy,
  Calendar,
  Target
} from 'lucide-react';

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    dailyRevenue: [],
    gamePopularity: [],
    userGrowth: [],
    betDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch daily revenue for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const dailyRevenuePromises = last7Days.map(async (date) => {
        const { data: bets } = await supabase
          .from('bets')
          .select('amount_inr, actual_win')
          .eq('bet_date', date);

        const totalBets = bets?.reduce((sum, bet) => sum + Number(bet.amount_inr), 0) || 0;
        const totalPayouts = bets?.reduce((sum, bet) => sum + Number(bet.actual_win), 0) || 0;
        const revenue = totalBets - totalPayouts;

        return {
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          revenue,
          bets: totalBets,
          payouts: totalPayouts
        };
      });

      const dailyRevenue = await Promise.all(dailyRevenuePromises);

      // Fetch game popularity
      const { data: gameStats } = await supabase
        .from('bets')
        .select(`
          game_id,
          amount_inr,
          games (name)
        `);

      const gamePopularity = gameStats?.reduce((acc: any, bet: any) => {
        const gameName = bet.games?.name || 'Unknown';
        if (!acc[gameName]) {
          acc[gameName] = { name: gameName, bets: 0, amount: 0 };
        }
        acc[gameName].bets += 1;
        acc[gameName].amount += Number(bet.amount_inr);
        return acc;
      }, {});

      // Fetch user growth (last 30 days)
      const { data: users } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const userGrowth = users?.reduce((acc: any, user: any) => {
        const date = new Date(user.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Fetch bet type distribution
      const { data: betTypes } = await supabase
        .from('bets')
        .select('bet_type, amount_inr');

      const betDistribution = betTypes?.reduce((acc: any, bet: any) => {
        const type = bet.bet_type.replace('_', ' ').toUpperCase();
        if (!acc[type]) {
          acc[type] = { name: type, value: 0, count: 0 };
        }
        acc[type].value += Number(bet.amount_inr);
        acc[type].count += 1;
        return acc;
      }, {});

      setAnalytics({
        dailyRevenue,
        gamePopularity: Object.values(gamePopularity || {}),
        userGrowth: Object.entries(userGrowth || {}).map(([date, count]) => ({ date, users: count })),
        betDistribution: Object.values(betDistribution || {})
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <Card className="glass-card border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse text-white">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Analytics */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Daily Revenue Trend (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value, name) => [`₹${Number(value).toLocaleString()}`, name]}
                />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                <Bar dataKey="bets" fill="#3B82F6" name="Total Bets" />
                <Bar dataKey="payouts" fill="#EF4444" name="Payouts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Popularity */}
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white hindi-font flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Popular Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.gamePopularity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {analytics.gamePopularity.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Total Bets']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bet Type Distribution */}
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white hindi-font flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Bet Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.betDistribution.map((bet: any, index: number) => (
                <motion.div
                  key={bet.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-white font-medium">{bet.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">₹{bet.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{bet.count} bets</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

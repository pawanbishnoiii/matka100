import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Crown, Star, Target, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  total_wins: number;
  total_amount_won: number;
  games_played: number;
  win_percentage: number;
  rank_position: number;
  points: number;
  users: {
    name: string;
    email: string;
    profile_image_url?: string;
  };
}

interface UserAchievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  points: number;
  unlocked_at: string;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboard();
    if (user) {
      fetchUserAchievements();
    }
  }, [selectedPeriod, user]);

  const fetchLeaderboard = async () => {
    try {
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

      const { data, error } = await supabase
        .from('leaderboards')
        .select(`
          *,
          users (name, email, profile_image_url)
        `)
        .eq('period_type', selectedPeriod)
        .gte('period_start', startDate.toISOString().split('T')[0])
        .order('rank_position', { ascending: true })
        .limit(50);

      if (error) throw error;

      const leaderboard = data || [];
      setLeaderboardData(leaderboard);

      // Find current user's rank
      if (user) {
        const currentUserRank = leaderboard.find(entry => entry.user_id === user.id);
        setUserRank(currentUserRank || null);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leaderboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gaming-text font-bold">#{position}</span>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-400/20 to-yellow-600/20 border-yellow-400/30';
      case 2:
        return 'from-gray-400/20 to-gray-600/20 border-gray-400/30';
      case 3:
        return 'from-amber-600/20 to-amber-800/20 border-amber-600/30';
      default:
        return 'from-gaming-card to-gaming-darker border-gaming-border';
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'wins':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'streak':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'points':
        return <Star className="w-5 h-5 text-blue-400" />;
      case 'games':
        return <Target className="w-5 h-5 text-purple-400" />;
      default:
        return <Award className="w-5 h-5 text-gaming-accent" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gaming-dark to-black flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark to-black p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">🏆 Leaderboard</h1>
          <p className="text-gaming-text-secondary">Compete with other players and climb the ranks!</p>
        </motion.div>

        {/* User Stats Card */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={`bg-gradient-to-r ${getRankColor(userRank.rank_position)} border`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getRankIcon(userRank.rank_position)}
                    <div>
                      <h3 className="text-xl font-bold text-white">Your Rank</h3>
                      <p className="text-gaming-text-secondary">
                        {userRank.total_wins} wins • {userRank.win_percentage.toFixed(1)}% win rate
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gaming-accent">
                      #{userRank.rank_position}
                    </div>
                    <div className="text-sm text-gaming-text-secondary">
                      {userRank.points} points
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="space-y-6">
          {/* Period Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <TabsList className="bg-gaming-card border-gaming-border">
              <TabsTrigger value="daily" className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black">
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black">
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black">
                Yearly
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Leaderboard Content */}
          <TabsContent value={selectedPeriod}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Leaderboard */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  {leaderboardData.length === 0 ? (
                    <Card className="bg-gaming-card border-gaming-border">
                      <CardContent className="p-8 text-center">
                        <Users className="w-16 h-16 text-gaming-text-secondary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Rankings Yet</h3>
                        <p className="text-gaming-text-secondary">Be the first to play and claim the top spot!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    leaderboardData.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`bg-gradient-to-r ${getRankColor(entry.rank_position)} border hover:scale-105 transition-transform`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {getRankIcon(entry.rank_position)}
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={entry.users.profile_image_url} />
                                  <AvatarFallback>
                                    {entry.users.name?.charAt(0) || entry.users.email.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold text-white">
                                    {entry.users.name || entry.users.email.split('@')[0]}
                                  </h4>
                                  <p className="text-sm text-gaming-text-secondary">
                                    {entry.total_wins} wins • {entry.games_played} games
                                  </p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-400">
                                  ₹{entry.total_amount_won.toLocaleString()}
                                </div>
                                <div className="text-sm text-gaming-text-secondary">
                                  {entry.win_percentage.toFixed(1)}% win rate
                                </div>
                                <Badge className="bg-gaming-primary text-black">
                                  {entry.points} pts
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </div>

              {/* Achievements Sidebar */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-gaming-card border-gaming-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Star className="w-5 h-5 text-gaming-accent" />
                        Your Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {userAchievements.length === 0 ? (
                        <div className="text-center py-4">
                          <Award className="w-12 h-12 text-gaming-text-secondary mx-auto mb-2" />
                          <p className="text-gaming-text-secondary text-sm">
                            Start playing to unlock achievements!
                          </p>
                        </div>
                      ) : (
                        userAchievements.slice(0, 5).map((achievement) => (
                          <div
                            key={achievement.id}
                            className="flex items-center gap-3 p-3 bg-gaming-darker/50 rounded-lg"
                          >
                            {getAchievementIcon(achievement.achievement_type)}
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-white truncate">
                                {achievement.achievement_name}
                              </h5>
                              <p className="text-xs text-gaming-text-secondary truncate">
                                {achievement.description}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <Badge className="bg-gaming-accent/20 text-gaming-accent">
                                  +{achievement.points} pts
                                </Badge>
                                <span className="text-xs text-gaming-text-secondary">
                                  {new Date(achievement.unlocked_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-gaming-card border-gaming-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <BarChart3 className="w-5 h-5 text-gaming-primary" />
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gaming-text-secondary">Total Players</span>
                        <span className="text-white font-semibold">{leaderboardData.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gaming-text-secondary">Top Win Rate</span>
                        <span className="text-gaming-accent font-semibold">
                          {leaderboardData[0]?.win_percentage.toFixed(1) || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gaming-text-secondary">Highest Earnings</span>
                        <span className="text-green-400 font-semibold">
                          ₹{leaderboardData[0]?.total_amount_won.toLocaleString() || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
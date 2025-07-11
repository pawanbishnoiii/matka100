
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Users, 
  Gamepad2, 
  TrendingUp, 
  Settings, 
  DollarSign,
  Calendar,
  Trophy,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Ban,
  UserCheck,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminGameManager } from '@/components/admin/AdminGameManager';
import { AdminUserManager } from '@/components/admin/AdminUserManager';
import { AdminPayoutManager } from '@/components/admin/AdminPayoutManager';
import { AdminSettingsManager } from '@/components/admin/AdminSettingsManager';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activeToday: 0,
    totalBetVolume: 0,
    totalPayout: 0,
    pendingWithdrawals: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAdminStats();
    }
  }, [user, isAdmin]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);

      // Fetch user statistics
      const { data: usersData } = await supabase
        .from('users')
        .select('id, created_at')
        .eq('is_admin', false);

      // Fetch today's active users (users who made bets today)
      const today = new Date().toISOString().split('T')[0];
      const { data: activeBetsData } = await supabase
        .from('bets')
        .select('user_id')
        .eq('bet_date', today);

      // Fetch bet statistics
      const { data: betsData } = await supabase
        .from('bets')
        .select('amount_inr, actual_win, bet_date')
        .eq('bet_date', today);

      // Fetch pending withdrawals
      const { data: withdrawalsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'withdrawal')
        .eq('status', 'pending');

      const totalPlayers = usersData?.length || 0;
      const activeToday = new Set(activeBetsData?.map(bet => bet.user_id)).size;
      const totalBetVolume = betsData?.reduce((sum, bet) => sum + Number(bet.amount_inr), 0) || 0;
      const totalPayout = betsData?.reduce((sum, bet) => sum + Number(bet.actual_win), 0) || 0;
      const pendingWithdrawals = withdrawalsData?.length || 0;
      const totalRevenue = totalBetVolume - totalPayout;

      setStats({
        totalPlayers,
        activeToday,
        totalBetVolume,
        totalPayout,
        pendingWithdrawals,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch admin statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <Card className="glass-card border-gray-700 neon-glow">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
            <p className="text-gray-400">Please log in to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <Card className="glass-card border-gray-700 neon-glow">
          <CardContent className="p-8 text-center">
            <Ban className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">You don't have permission to access the admin panel.</p>
          </CardContent>
        </Card>
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white hindi-font">Admin Control Panel</h1>
              <p className="text-sm text-gray-400">Matka100 Management System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Welcome back,</p>
              <p className="text-white font-semibold">{user.email}</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          <Card className="glass-card border-gray-700 neon-blue-glow">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{loading ? '...' : stats.totalPlayers.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Total Players</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-gray-700 neon-green-glow">
            <CardContent className="p-4 text-center">
              <UserCheck className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{loading ? '...' : stats.activeToday}</p>
              <p className="text-xs text-gray-400">Active Today</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-gray-700 neon-yellow-glow">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">₹{loading ? '...' : (stats.totalBetVolume / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-400">Bet Volume</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-gray-700 neon-purple-glow">
            <CardContent className="p-4 text-center">
              <Wallet className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">₹{loading ? '...' : (stats.totalPayout / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-400">Total Payout</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-gray-700 neon-red-glow">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{loading ? '...' : stats.pendingWithdrawals}</p>
              <p className="text-xs text-gray-400">Pending</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-gray-700 neon-glow">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">₹{loading ? '...' : (stats.totalRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-400">Revenue</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Management Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="games" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 glass-card p-1">
              <TabsTrigger value="games" className="data-[state=active]:bg-blue-600 text-white">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Games
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-green-600 text-white">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="payouts" className="data-[state=active]:bg-yellow-600 text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Payouts
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600 text-white">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600 text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="games">
              <AdminGameManager onStatsUpdate={fetchAdminStats} />
            </TabsContent>

            <TabsContent value="users">
              <AdminUserManager onStatsUpdate={fetchAdminStats} />
            </TabsContent>

            <TabsContent value="payouts">
              <AdminPayoutManager onStatsUpdate={fetchAdminStats} />
            </TabsContent>

            <TabsContent value="settings">
              <AdminSettingsManager />
            </TabsContent>

            <TabsContent value="analytics">
              <AdminAnalytics />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Bottom Padding */}
      <div className="h-20"></div>
    </div>
  );
};

export default AdminPage;

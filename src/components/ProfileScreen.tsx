import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserStatistics } from '@/hooks/useUserStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  User, 
  TrendingUp, 
  Trophy, 
  Calendar, 
  DollarSign,
  Target,
  Settings,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/layout/BottomNavigation';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { statistics, loading, error } = useUserStatistics();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4 pb-24">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {/* Statistics Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="glass-card border-gray-700">
                <CardContent className="p-4">
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-6 w-20" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <Card className="glass-card border-red-500/50 col-span-full">
              <CardContent className="p-4 text-center">
                <p className="text-red-400">Error loading statistics: {error}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="glass-card border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Bets</p>
                      <p className="text-2xl font-bold text-white">
                        {statistics?.total_bets || 0}
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Wins</p>
                      <p className="text-2xl font-bold text-white">
                        {statistics?.total_wins || 0}
                      </p>
                    </div>
                    <Trophy className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Win Rate</p>
                      <p className="text-2xl font-bold text-white">
                        {statistics?.win_percentage?.toFixed(1) || 0}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-yellow-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Won</p>
                      <p className="text-xl font-bold text-white">
                        ₹{statistics?.total_amount_won?.toLocaleString() || 0}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>

        {/* Account Details */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Member Since</p>
                <p className="text-white">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last Bet</p>
                <p className="text-white">
                  {statistics?.last_bet_date 
                    ? new Date(statistics.last_bet_date).toLocaleDateString()
                    : 'No bets yet'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => navigate('/wallet')}
              >
                Manage Wallet
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => navigate('/help')}
              >
                Help & Support
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <BottomNavigation />
    </>
  );
};

export default ProfileScreen;

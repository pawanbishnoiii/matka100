
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Edit3, Wallet, Trophy, Settings, HelpCircle, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/hooks/useAuth';
import { useUserStatistics } from '@/hooks/useUserStatistics';
import { supabase } from '@/integrations/supabase/client';

const EnhancedProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { statistics, loading: statsLoading } = useUserStatistics();
  const [activeTab, setActiveTab] = useState('overview');
  const [balances, setBalances] = useState({ inr: 0, gbp: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBalance();
  }, [user]);

  const fetchUserBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('balance_inr, balance_gbp')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching balance:', error);
      } else {
        setBalances({
          inr: data?.balance_inr || 0,
          gbp: data?.balance_gbp || 0
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <p className="text-white mb-4">Please login to access your profile</p>
          <Button onClick={() => navigate('/auth')} className="bg-purple-600 hover:bg-purple-700">
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Get display name with proper fallback
  const getDisplayName = () => {
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Get profile image URL
  const getProfileImage = () => {
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    if (user?.user_metadata?.picture) return user.user_metadata.picture;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 bg-black/30 backdrop-blur-sm rounded-lg p-4"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-white hindi-font">My Profile</h1>
          <div className="w-20"></div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6 bg-gray-800/50 border border-gray-700">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="edit" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Summary Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-1"
                >
                  <Card className="glass-card border-gray-700">
                    <CardHeader className="text-center">
                      <div className="relative mx-auto mb-4">
                        {getProfileImage() ? (
                          <img 
                            src={getProfileImage()!} 
                            alt="Profile" 
                            className="w-20 h-20 rounded-full object-cover border-4 border-purple-500"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                          </div>
                        )}
                        {/* Verification Badge */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CardTitle className="text-white hindi-font">
                          {getDisplayName()}
                        </CardTitle>
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </div>
                      <p className="text-gray-400">{user?.email}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className="text-green-400 bg-green-900/20 px-2 py-1 rounded text-sm">Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">KYC Status</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-blue-400 bg-blue-900/20 px-2 py-1 rounded text-sm">Verified</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Member Since</span>
                        <span className="text-white text-sm">
                          {new Date(user?.created_at || '').toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="lg:col-span-2 space-y-6"
                >
                  {/* Wallet Summary */}
                  <Card className="glass-card border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white hindi-font flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-green-400" />
                        Wallet Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg p-4">
                          <h3 className="text-green-400 font-semibold mb-2">INR Balance</h3>
                          {loading ? (
                            <div className="animate-pulse">
                              <div className="h-8 bg-gray-700 rounded mb-2"></div>
                            </div>
                          ) : (
                            <p className="text-2xl font-bold text-white">₹{balances.inr.toLocaleString()}</p>
                          )}
                        </div>
                        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-lg p-4">
                          <h3 className="text-blue-400 font-semibold mb-2">GBP Balance</h3>
                          {loading ? (
                            <div className="animate-pulse">
                              <div className="h-8 bg-gray-700 rounded mb-2"></div>
                            </div>
                          ) : (
                            <p className="text-2xl font-bold text-white">£{balances.gbp.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-4">
                        <Button 
                          onClick={() => navigate('/wallet')}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          <Wallet className="w-4 h-4 mr-2" />
                          Manage Wallet
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gaming Statistics */}
                  <Card className="glass-card border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white hindi-font flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Gaming Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {statsLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="text-center">
                              <div className="h-8 bg-gray-700 rounded mb-2"></div>
                              <div className="h-4 bg-gray-700 rounded"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">{statistics?.total_bets || 0}</p>
                            <p className="text-gray-400 text-sm">Total Bets</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">{statistics?.total_wins || 0}</p>
                            <p className="text-gray-400 text-sm">Wins</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white">₹{statistics?.total_amount_bet ? statistics.total_amount_bet.toLocaleString() : 0}</p>
                            <p className="text-gray-400 text-sm">Total Wagered</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-400">₹{statistics?.total_amount_won ? statistics.total_amount_won.toLocaleString() : 0}</p>
                            <p className="text-gray-400 text-sm">Total Won</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="glass-card border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white hindi-font flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-400" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('edit')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/help')}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Help & Support
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="edit" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white hindi-font mb-2">Edit Profile Information</h2>
                  <p className="text-gray-400">Update your personal details and preferences</p>
                </div>
                <ProfileForm />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedProfilePage;

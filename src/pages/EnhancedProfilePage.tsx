
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Edit3, Wallet, Trophy, Settings, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/hooks/useAuth';

const EnhancedProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

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
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <CardTitle className="text-white hindi-font">
                        {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                      </CardTitle>
                      <p className="text-gray-400">{user?.email}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className="text-green-400 bg-green-900/20 px-2 py-1 rounded text-sm">Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">KYC Status</span>
                        <span className="text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded text-sm">Pending</span>
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
                          <p className="text-2xl font-bold text-white">₹0.00</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-lg p-4">
                          <h3 className="text-blue-400 font-semibold mb-2">GBP Balance</h3>
                          <p className="text-2xl font-bold text-white">£0.00</p>
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

                  {/* Gaming Stats */}
                  <Card className="glass-card border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white hindi-font flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Gaming Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">0</p>
                          <p className="text-gray-400 text-sm">Total Bets</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-400">0</p>
                          <p className="text-gray-400 text-sm">Wins</p>
                        </div>
                        <div className="text-2xl font-bold text-white text-center">
                          <p className="text-2xl font-bold text-white">₹0</p>
                          <p className="text-gray-400 text-sm">Total Wagered</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-400">₹0</p>
                          <p className="text-gray-400 text-sm">Total Won</p>
                        </div>
                      </div>
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

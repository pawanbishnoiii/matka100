
import { useState } from 'react';
import { motion } from 'framer-motion';
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
  XCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');

  // Mock admin data
  const [stats] = useState({
    totalPlayers: 10547,
    activeToday: 2834,
    totalBetVolume: 2750000,
    totalPayout: 2465000,
    pendingWithdrawals: 12,
    totalRevenue: 285000
  });

  const [games] = useState([
    { id: 1, name: 'Desawar', timing: '04:30 AM', status: 'active', betAmount: 125000, players: 245 },
    { id: 2, name: 'Gali', timing: '11:00 PM', status: 'active', betAmount: 98000, players: 189 },
    { id: 3, name: 'Faridabad', timing: '06:15 PM', status: 'active', betAmount: 87500, players: 167 },
    { id: 4, name: 'Ghaziabad', timing: '08:00 PM', status: 'closed', betAmount: 145000, players: 278 },
  ]);

  const [users] = useState([
    { id: 1, name: 'Raj Kumar', email: 'raj@email.com', balance: 15750, status: 'active', bets: 47 },
    { id: 2, name: 'Priya Singh', email: 'priya@email.com', balance: 8900, status: 'active', bets: 23 },
    { id: 3, name: 'Amit Patel', email: 'amit@email.com', balance: 0, status: 'suspended', bets: 156 },
    { id: 4, name: 'Sunita Sharma', email: 'sunita@email.com', balance: 22500, status: 'active', bets: 89 },
  ]);

  const handleAdminLogin = () => {
    if (email === 'bnoy.studios@gmail.com') {
      setIsAuthenticated(true);
    } else {
      alert('Unauthorized email address');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="glass-card border-gray-700 neon-glow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white hindi-font">Admin Login</CardTitle>
              <p className="text-gray-400">Authorized access only</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
              <Button 
                onClick={handleAdminLogin}
                className="w-full neon-glow bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <Shield className="w-4 h-4 mr-2" />
                Login to Admin Panel
              </Button>
            </CardContent>
          </Card>
        </motion.div>
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
              <h1 className="text-2xl font-bold text-white hindi-font">Admin Panel</h1>
              <p className="text-sm text-gray-400">Matka100 Control Center</p>
            </div>
          </div>
          
          <Button
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
            className="glass-card border-red-600/50 text-red-400 hover:bg-red-600/10"
          >
            Logout
          </Button>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass-card border-gray-700 neon-blue-glow">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats.totalPlayers.toLocaleString()}</p>
              <p className="text-gray-400">Total Players</p>
              <p className="text-sm text-green-400 mt-1">+{stats.activeToday} today</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-gray-700 neon-green-glow">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">₹{(stats.totalBetVolume / 100000).toFixed(1)}L</p>
              <p className="text-gray-400">Bet Volume</p>
              <p className="text-sm text-blue-400 mt-1">Today</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-gray-700 neon-glow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
              <p className="text-gray-400">Revenue</p>
              <p className="text-sm text-yellow-400 mt-1">Today</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-gray-700 neon-red-glow">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stats.pendingWithdrawals}</p>
              <p className="text-gray-400">Pending</p>
              <p className="text-sm text-red-400 mt-1">Withdrawals</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="games" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4 glass-card">
              <TabsTrigger value="games" className="data-[state=active]:bg-blue-600">Games</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-green-600">Users</TabsTrigger>
              <TabsTrigger value="payouts" className="data-[state=active]:bg-yellow-600">Payouts</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
            </TabsList>

            {/* Games Management */}
            <TabsContent value="games">
              <Card className="glass-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white hindi-font flex items-center gap-2">
                    <Gamepad2 className="w-6 h-6 text-blue-400" />
                    Game Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {games.map((game) => (
                      <div key={game.id} className="glass-card p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="text-lg font-bold text-white">{game.name}</h3>
                              <p className="text-gray-400">Opening: {game.timing}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              game.status === 'active' 
                                ? 'bg-green-600/20 text-green-400' 
                                : 'bg-red-600/20 text-red-400'
                            }`}>
                              {game.status.toUpperCase()}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-white font-bold">₹{game.betAmount.toLocaleString()}</p>
                            <p className="text-gray-400 text-sm">{game.players} players</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Set Result
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-600">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Management */}
            <TabsContent value="users">
              <Card className="glass-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white hindi-font flex items-center gap-2">
                    <Users className="w-6 h-6 text-green-400" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="glass-card p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{user.name}</h3>
                              <p className="text-gray-400">{user.email}</p>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-white font-bold">₹{user.balance.toLocaleString()}</p>
                            <p className="text-gray-400 text-sm">{user.bets} bets</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === 'active' 
                                ? 'bg-green-600/20 text-green-400' 
                                : 'bg-red-600/20 text-red-400'
                            }`}>
                              {user.status.toUpperCase()}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-gray-600">
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                className={user.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                              >
                                {user.status === 'active' ? 'Suspend' : 'Activate'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payouts Management */}
            <TabsContent value="payouts">
              <Card className="glass-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white hindi-font flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                    Payout Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, user: 'Raj Kumar', amount: 5000, method: 'UPI', status: 'pending', time: '2 mins ago' },
                      { id: 2, user: 'Priya Singh', amount: 2500, method: 'Bank', status: 'approved', time: '1 hour ago' },
                      { id: 3, user: 'Amit Patel', amount: 7500, method: 'UPI', status: 'rejected', time: '3 hours ago' },
                    ].map((payout) => (
                      <div key={payout.id} className="glass-card p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white">{payout.user}</h3>
                            <p className="text-gray-400">{payout.method} • {payout.time}</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-white font-bold">₹{payout.amount.toLocaleString()}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              payout.status === 'approved' 
                                ? 'bg-green-600/20 text-green-400' 
                                : payout.status === 'rejected'
                                ? 'bg-red-600/20 text-red-400'
                                : 'bg-yellow-600/20 text-yellow-400'
                            }`}>
                              {payout.status.toUpperCase()}
                            </div>
                            
                            {payout.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics">
              <Card className="glass-card border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white hindi-font flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-white mb-4">Daily Revenue Trend</h3>
                      <div className="h-40 flex items-end justify-between gap-2">
                        {[65, 78, 82, 91, 76, 88, 95].map((height, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                            style={{ height: `${height}%`, width: '12%' }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                    
                    <div className="glass-card p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-white mb-4">Popular Games</h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Desawar', percentage: 32 },
                          { name: 'Gali', percentage: 28 },
                          { name: 'Faridabad', percentage: 24 },
                          { name: 'Ghaziabad', percentage: 16 }
                        ].map((game) => (
                          <div key={game.name}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-white">{game.name}</span>
                              <span className="text-gray-400">{game.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                                style={{ width: `${game.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

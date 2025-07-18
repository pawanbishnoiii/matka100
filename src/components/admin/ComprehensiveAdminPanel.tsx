import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  GamepadIcon, 
  DollarSign, 
  Settings, 
  BarChart3, 
  Bell,
  Shield,
  Download,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  activeGames: number;
  totalRevenue: number;
  pendingDeposits: number;
  dailySignups: number;
  monthlyRevenue: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  balance_inr: number;
  status: string;
  created_at: string;
  last_login_at: string;
}

interface Game {
  id: string;
  name: string;
  opening_time: string;
  result_time: string;
  status: string;
  is_active: boolean;
  multipliers: any;
}

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  users: {
    email: string;
    name: string;
  };
}

const ComprehensiveAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchGames(),
        fetchTransactions()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch admin data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch active games count
      const { count: gameCount } = await supabase
        .from('games')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch total revenue
      const { data: revenueData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'deposit')
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, t) => sum + t.amount, 0) || 0;

      // Fetch pending deposits
      const { count: pendingCount } = await supabase
        .from('manual_deposits')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch daily signups
      const today = new Date().toISOString().split('T')[0];
      const { count: dailySignups } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // Fetch monthly revenue
      const monthStart = new Date();
      monthStart.setDate(1);
      const { data: monthlyData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'deposit')
        .eq('status', 'completed')
        .gte('created_at', monthStart.toISOString());

      const monthlyRevenue = monthlyData?.reduce((sum, t) => sum + t.amount, 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        activeGames: gameCount || 0,
        totalRevenue,
        pendingDeposits: pendingCount || 0,
        dailySignups: dailySignups || 0,
        monthlyRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, balance_inr, status, created_at, last_login_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          user_id,
          type,
          amount,
          status,
          created_at,
          users (email, name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'suspended' | 'banned') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `User status updated to ${status}`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const exportData = (type: string) => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = users.map(user => ({
          Email: user.email,
          Name: user.name,
          Balance: user.balance_inr,
          Status: user.status,
          'Created At': new Date(user.created_at).toLocaleDateString(),
        }));
        filename = 'users-export.csv';
        break;
      case 'transactions':
        data = transactions.map(transaction => ({
          Type: transaction.type,
          Amount: transaction.amount,
          Status: transaction.status,
          User: transaction.users.email,
          'Created At': new Date(transaction.created_at).toLocaleDateString(),
        }));
        filename = 'transactions-export.csv';
        break;
      case 'games':
        data = games.map(game => ({
          Name: game.name,
          'Opening Time': game.opening_time,
          'Result Time': game.result_time,
          Status: game.status,
          Active: game.is_active ? 'Yes' : 'No',
        }));
        filename = 'games-export.csv';
        break;
    }

    const csvContent = [
      Object.keys(data[0] || {}),
      ...data.map(row => Object.values(row))
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Exported',
      description: `${type} data exported successfully`,
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gaming-dark to-black flex items-center justify-center">
        <Card className="bg-gaming-card border-gaming-border">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gaming-text-secondary">You don't have admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gaming-dark to-black flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark to-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gaming-text-secondary">Comprehensive platform management</p>
          </div>
          <Button
            onClick={fetchAdminData}
            variant="outline"
            className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-black"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
          >
            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gaming-text-secondary text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-gaming-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gaming-text-secondary text-sm">Active Games</p>
                    <p className="text-2xl font-bold text-white">{stats.activeGames}</p>
                  </div>
                  <GamepadIcon className="w-8 h-8 text-gaming-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gaming-text-secondary text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-400">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gaming-text-secondary text-sm">Pending Deposits</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.pendingDeposits}</p>
                  </div>
                  <Bell className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gaming-text-secondary text-sm">Daily Signups</p>
                    <p className="text-2xl font-bold text-blue-400">{stats.dailySignups}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gaming-text-secondary text-sm">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-purple-400">₹{stats.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gaming-card border-gaming-border">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black">
                Users
              </TabsTrigger>
              <TabsTrigger value="games" className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black">
                Games
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gaming-primary data-[state=active]:text-black">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <Card className="bg-gaming-card border-gaming-border">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">User Management</CardTitle>
                    <Button
                      onClick={() => exportData('users')}
                      variant="outline"
                      size="sm"
                      className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-black"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gaming-input border-gaming-border text-white"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-48 bg-gaming-input border-gaming-border text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gaming-card border-gaming-border">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gaming-border">
                          <TableHead className="text-gaming-text-secondary">Email</TableHead>
                          <TableHead className="text-gaming-text-secondary">Name</TableHead>
                          <TableHead className="text-gaming-text-secondary">Balance</TableHead>
                          <TableHead className="text-gaming-text-secondary">Status</TableHead>
                          <TableHead className="text-gaming-text-secondary">Joined</TableHead>
                          <TableHead className="text-gaming-text-secondary">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users
                          .filter(user => 
                            (searchTerm === '' || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             user.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                            (filterStatus === 'all' || user.status === filterStatus)
                          )
                          .map((user) => (
                            <TableRow key={user.id} className="border-gaming-border">
                              <TableCell className="text-white">{user.email}</TableCell>
                              <TableCell className="text-white">{user.name || 'N/A'}</TableCell>
                              <TableCell className="text-green-400">₹{user.balance_inr.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={`${
                                    user.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                    user.status === 'suspended' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                    'bg-red-500/20 text-red-400 border-red-500/30'
                                  }`}
                                >
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gaming-text-secondary">
                                {new Date(user.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                                    className="border-gaming-border text-gaming-text hover:bg-gaming-hover"
                                  >
                                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gaming-border text-gaming-text hover:bg-gaming-hover"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Games Tab */}
            <TabsContent value="games" className="space-y-4">
              <Card className="bg-gaming-card border-gaming-border">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Game Management</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => exportData('games')}
                        variant="outline"
                        size="sm"
                        className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-black"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gaming-primary text-gaming-primary hover:bg-gaming-primary hover:text-black"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Game
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gaming-border">
                          <TableHead className="text-gaming-text-secondary">Game Name</TableHead>
                          <TableHead className="text-gaming-text-secondary">Opening Time</TableHead>
                          <TableHead className="text-gaming-text-secondary">Result Time</TableHead>
                          <TableHead className="text-gaming-text-secondary">Status</TableHead>
                          <TableHead className="text-gaming-text-secondary">Active</TableHead>
                          <TableHead className="text-gaming-text-secondary">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {games.map((game) => (
                          <TableRow key={game.id} className="border-gaming-border">
                            <TableCell className="text-white font-semibold">{game.name}</TableCell>
                            <TableCell className="text-gaming-text">{game.opening_time}</TableCell>
                            <TableCell className="text-gaming-text">{game.result_time}</TableCell>
                            <TableCell>
                              <Badge 
                                className={`${
                                  game.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                  'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                }`}
                              >
                                {game.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={`${
                                  game.is_active ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                  'bg-red-500/20 text-red-400 border-red-500/30'
                                }`}
                              >
                                {game.is_active ? 'Yes' : 'No'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gaming-border text-gaming-text hover:bg-gaming-hover"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gaming-border text-gaming-text hover:bg-gaming-hover"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-4">
              <Card className="bg-gaming-card border-gaming-border">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Transaction Management</CardTitle>
                    <Button
                      onClick={() => exportData('transactions')}
                      variant="outline"
                      size="sm"
                      className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-black"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gaming-border">
                          <TableHead className="text-gaming-text-secondary">User</TableHead>
                          <TableHead className="text-gaming-text-secondary">Type</TableHead>
                          <TableHead className="text-gaming-text-secondary">Amount</TableHead>
                          <TableHead className="text-gaming-text-secondary">Status</TableHead>
                          <TableHead className="text-gaming-text-secondary">Date</TableHead>
                          <TableHead className="text-gaming-text-secondary">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id} className="border-gaming-border">
                            <TableCell className="text-white">
                              {transaction.users.name || transaction.users.email}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={`${
                                  transaction.type === 'deposit' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                  transaction.type === 'withdrawal' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                  'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                }`}
                              >
                                {transaction.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-white font-semibold">
                              ₹{transaction.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={`${
                                  transaction.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                  transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                  'bg-red-500/20 text-red-400 border-red-500/30'
                                }`}
                              >
                                {transaction.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gaming-text-secondary">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gaming-border text-gaming-text hover:bg-gaming-hover"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ComprehensiveAdminPanel;
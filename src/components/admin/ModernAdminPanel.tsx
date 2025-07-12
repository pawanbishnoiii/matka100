
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Bell,
  Search,
  ChevronRight,
  PlayCircle,
  StopCircle,
  Trophy,
  Gamepad2,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminGameManager } from './AdminGameManager';
import { AdminPayoutManager } from './AdminPayoutManager';
import { AdminRazorpayPayments } from './AdminRazorpayPayments';
import { AdminManualDeposits } from './AdminManualDeposits';
import { AdminPaymentGateway } from './AdminPaymentGateway';

// Indian Admin Mascot Component
const AdminMascot = () => (
  <motion.div
    className="fixed bottom-6 right-6 z-50"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 2, duration: 0.8 }}
  >
    <motion.div
      className="relative cursor-pointer group"
      animate={{ 
        y: [0, -8, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.1 }}
    >
      {/* Mascot Figure */}
      <div className="w-16 h-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-purple-600 rounded-full shadow-lg"></div>
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-14 bg-gradient-to-b from-indigo-500 to-purple-700 rounded-b-full"></div>
        {/* Glowing Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-xl"></div>
      </div>
      
      {/* Tooltip */}
      <motion.div
        className="absolute -left-32 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        <p className="text-xs font-semibold whitespace-nowrap">Admin Helper 🎯</p>
        <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-6 border-l-blue-600 border-t-3 border-b-3 border-t-transparent border-b-transparent"></div>
      </motion.div>
    </motion.div>
  </motion.div>
);

// Date Strip Navigation Component
const DateStripNavigation = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const generateDates = () => {
      const today = new Date();
      const dateArray = [];
      for (let i = -3; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dateArray.push(date);
      }
      setDates(dateArray);
    };
    generateDates();
  }, []);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      className="flex gap-2 overflow-x-auto pb-2 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {dates.map((date, index) => {
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const isToday = date.toDateString() === new Date().toDateString();
        
        return (
          <motion.button
            key={index}
            onClick={() => setSelectedDate(date)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              isSelected 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : isToday
                ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/50 text-green-400'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex flex-col items-center">
              <span>{formatDate(date)}</span>
              <span className="text-xs opacity-75">{date.getDate()}</span>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

// Stats Cards Component
const StatsCards = () => {
  const stats = [
    { 
      title: 'Total Users', 
      value: '2,450', 
      change: '+12%', 
      icon: Users, 
      color: 'text-blue-400',
      bgColor: 'from-blue-900/30 to-indigo-900/30',
      borderColor: 'border-blue-500/30'
    },
    { 
      title: 'Today Revenue', 
      value: '₹1,25,000', 
      change: '+8%', 
      icon: DollarSign, 
      color: 'text-green-400',
      bgColor: 'from-green-900/30 to-emerald-900/30',
      borderColor: 'border-green-500/30'
    },
    { 
      title: 'Active Games', 
      value: '12', 
      change: '100%', 
      icon: Gamepad2, 
      color: 'text-purple-400',
      bgColor: 'from-purple-900/30 to-pink-900/30',
      borderColor: 'border-purple-500/30'
    },
    { 
      title: 'Pending Payouts', 
      value: '₹45,200', 
      change: '-2%', 
      icon: CreditCard, 
      color: 'text-orange-400',
      bgColor: 'from-orange-900/30 to-red-900/30',
      borderColor: 'border-orange-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`glass-card bg-gradient-to-r ${stat.bgColor} border ${stat.borderColor} hover:shadow-lg transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className={`text-sm font-semibold mt-1 ${
                    stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change} from yesterday
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-black/20 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export const ModernAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4">
      {/* Admin Mascot */}
      <AdminMascot />

      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white hindi-font mb-2">
              MATKA 100 Admin Panel
            </h1>
            <p className="text-gray-400">Manage your gaming platform with ease</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white pl-10 w-64"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Date Strip Navigation */}
      <DateStripNavigation />

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Games
            </TabsTrigger>
            <TabsTrigger value="payouts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-orange-600 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Payouts
            </TabsTrigger>
            <TabsTrigger value="deposits" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Deposits
            </TabsTrigger>
            <TabsTrigger value="razorpay" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Razorpay
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-700 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-card border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Recent Winners
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {['Raj***', 'Pri***', 'Arn***'].map((winner, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                            <div>
                              <p className="text-white font-semibold">{winner}</p>
                              <p className="text-gray-400 text-sm">Kalyan Matka</p>
                            </div>
                            <p className="text-green-400 font-bold">₹{(Math.random() * 50000).toFixed(0)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-green-400" />
                        Active Games Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {['Kalyan', 'Milan', 'Rajdhani'].map((game, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                            <div>
                              <p className="text-white font-semibold">{game}</p>
                              <p className="text-gray-400 text-sm">Opens at 3:45 PM</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-green-400 text-sm font-semibold">OPEN</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="games">
                <AdminGameManager />
              </TabsContent>

              <TabsContent value="payouts">
                <AdminPayoutManager onStatsUpdate={() => {}} />
              </TabsContent>

              <TabsContent value="deposits">
                <AdminManualDeposits />
              </TabsContent>

              <TabsContent value="razorpay">
                <AdminRazorpayPayments />
              </TabsContent>

              <TabsContent value="settings">
                <AdminPaymentGateway />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
};

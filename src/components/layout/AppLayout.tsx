
import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User, 
  Wallet, 
  Gamepad2, 
  Trophy, 
  BarChart3, 
  HelpCircle,
  Bell,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(3);

  const bottomNavItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/', color: 'from-blue-500 to-purple-500' },
    { id: 'games', label: 'Games', icon: Gamepad2, path: '/games', color: 'from-green-500 to-emerald-500' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, path: '/wallet', color: 'from-yellow-500 to-orange-500' },
    { id: 'results', label: 'Results', icon: Trophy, path: '/results', color: 'from-red-500 to-pink-500' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile', color: 'from-purple-500 to-indigo-500' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col">
      {/* Status Bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      {/* App Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/50 backdrop-blur-xl border-b border-gray-700/50 p-4 sticky top-0 z-50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MATKA 100</h1>
              <p className="text-xs text-gray-400">Win Big, Play Smart</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-400" />
              {notifications > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  {notifications}
                </Badge>
              )}
            </div>
            <Settings className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-black/80 backdrop-blur-xl border-t border-gray-700/50 p-4 safe-area-pb"
      >
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 relative"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl opacity-20`}
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                <div className={`p-2 rounded-lg ${active ? `bg-gradient-to-r ${item.color}` : 'bg-gray-700/50'} transition-all duration-300`}>
                  <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <span className={`text-xs font-medium ${active ? 'text-white' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
};

export default AppLayout;

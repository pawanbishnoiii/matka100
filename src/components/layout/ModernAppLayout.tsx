
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User, 
  Wallet, 
  Gamepad2, 
  Trophy, 
  Bell,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PremiumButton } from '@/components/ui/premium-modern-button';
import { PremiumGlassCard } from '@/components/ui/premium-glass-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  color: string;
  gradient: string;
  badge?: number;
}

const ModernAppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(3);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home, 
      path: '/', 
      color: 'text-blue-400',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'games', 
      label: 'Games', 
      icon: Gamepad2, 
      path: '/games', 
      color: 'text-green-400',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'wallet', 
      label: 'Wallet', 
      icon: Wallet, 
      path: '/wallet', 
      color: 'text-yellow-400',
      gradient: 'from-yellow-500 to-orange-500'
    },
    { 
      id: 'results', 
      label: 'Results', 
      icon: Trophy, 
      path: '/results', 
      color: 'text-purple-400',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      path: '/profile', 
      color: 'text-indigo-400',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-float" />
      </div>

      {/* Status Bar Gradient */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative z-50" />
      
      {/* Premium Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 safe-area-top"
      >
        <div className="flex items-center justify-between p-4">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                MATKA 100
              </h1>
              <p className="text-xs text-gray-400 font-medium">Premium Gaming</p>
            </div>
          </motion.div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <motion.button
              className="relative p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-5 h-5 text-white" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0 animate-pulse">
                  {notifications}
                </Badge>
              )}
            </motion.button>

            {/* Settings */}
            <motion.button
              className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="w-5 h-5 text-white" />
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.3 
            }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Bottom Navigation */}
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      >
        <PremiumGlassCard 
          className="mx-4 mb-4 p-3"
          variant="elevated"
          blur="xl"
          glow
        >
          <div className="flex items-center justify-around">
            {navigationItems.map((item, index) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 group"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Active Background */}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-20`}
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  
                  {/* Icon Container */}
                  <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                    active 
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                      : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors duration-300 ${
                      active ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`} />
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs font-medium transition-colors duration-300 ${
                    active ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Badge */}
                  {item.badge && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-red-500 animate-pulse">
                      {item.badge}
                    </Badge>
                  )}
                  
                  {/* Glow Effect */}
                  {active && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl blur-md opacity-30 -z-10`} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </PremiumGlassCard>
      </motion.nav>
    </div>
  );
};

export default ModernAppLayout;

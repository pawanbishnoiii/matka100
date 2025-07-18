import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  X,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ui/theme-provider';
import { PremiumButton } from '@/components/ui/premium-modern-button';
import { PremiumGlassCard } from '@/components/ui/premium-glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface ResponsiveNavigationProps {
  notifications?: number;
}

const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({ 
  notifications = 0 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { 
      id: 'games', 
      label: 'Games', 
      icon: Gamepad2, 
      path: '/games', 
      color: 'text-gaming-green',
      gradient: 'from-gaming-green to-gaming-cyan'
    },
    { 
      id: 'wallet', 
      label: 'Wallet', 
      icon: Wallet, 
      path: '/wallet', 
      color: 'text-gaming-yellow',
      gradient: 'from-gaming-yellow to-orange-500'
    },
    { 
      id: 'results', 
      label: 'Results', 
      icon: Trophy, 
      path: '/results', 
      color: 'text-gaming-purple',
      gradient: 'from-gaming-purple to-pink-500'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      path: '/profile', 
      color: 'text-gaming-blue',
      gradient: 'from-gaming-blue to-gaming-purple'
    }
  ];

  // Add admin option if user is admin
  if (isAdmin) {
    navigationItems.push({
      id: 'admin',
      label: 'Admin',
      icon: Settings,
      path: '/admin',
      color: 'text-gaming-red',
      gradient: 'from-gaming-red to-red-600'
    });
  }

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return Sun;
      case 'dark': return Moon;
      default: return Monitor;
    }
  };

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const ThemeIcon = getThemeIcon();

  return (
    <>
      {/* Premium Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 bg-card/80 backdrop-blur-xl border-b border-border safe-area-top"
      >
        <div className="flex items-center justify-between p-4">
          {/* Logo Section */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/games')}
          >
            <div className="relative cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-2xl flex items-center justify-center shadow-gaming">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gaming-neon rounded-full border-2 border-background animate-neon-flicker" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-gaming bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                MATKA 100
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Premium Gaming</p>
            </div>
          </motion.div>
          
          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={cycleTheme}
              className="p-2 rounded-xl bg-muted/50 backdrop-blur-sm border border-border hover:bg-muted transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThemeIcon className="w-5 h-5 text-foreground" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              className="relative p-2 rounded-xl bg-muted/50 backdrop-blur-sm border border-border hover:bg-muted transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-5 h-5 text-foreground" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gaming-red text-white text-xs flex items-center justify-center p-0 animate-glow-pulse">
                  {notifications}
                </Badge>
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden p-2 rounded-xl bg-muted/50 backdrop-blur-sm border border-border hover:bg-muted transition-colors"
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
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-card border-r border-border md:hidden safe-area-top"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-xl flex items-center justify-center">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-gaming font-semibold">MATKA 100</h2>
                      <p className="text-sm text-muted-foreground">Navigation</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="flex-1 p-4 space-y-2">
                {navigationItems.map((item, index) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                        active 
                          ? "bg-primary/10 border border-primary/20" 
                          : "hover:bg-muted/50"
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        active 
                          ? `bg-gradient-to-r ${item.gradient}` 
                          : "bg-muted"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5 transition-colors duration-300",
                          active ? "text-white" : "text-muted-foreground"
                        )} />
                      </div>
                      <span className={cn(
                        "font-medium transition-colors duration-300",
                        active ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge className="ml-auto bg-gaming-red">
                          {item.badge}
                        </Badge>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation (Bottom) */}
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-bottom"
      >
        <PremiumGlassCard 
          className="mx-4 mb-4 p-3"
          variant="elevated"
          blur="xl"
          glow
        >
          <div className="flex items-center justify-around">
            {navigationItems.slice(0, 4).map((item, index) => {
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
                  <div className={cn(
                    "p-2.5 rounded-xl transition-all duration-300",
                    active 
                      ? `bg-gradient-to-r ${item.gradient} shadow-gaming` 
                      : 'bg-muted/50 group-hover:bg-muted'
                  )}>
                    <Icon className={cn(
                      "w-5 h-5 transition-colors duration-300",
                      active ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                    )} />
                  </div>
                  
                  {/* Label */}
                  <span className={cn(
                    "text-xs font-medium transition-colors duration-300",
                    active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )}>
                    {item.label}
                  </span>
                  
                  {/* Badge */}
                  {item.badge && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-gaming-red animate-glow-pulse">
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
    </>
  );
};

export default ResponsiveNavigation;
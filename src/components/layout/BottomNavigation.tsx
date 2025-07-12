
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Gamepad2, 
  Wallet, 
  Trophy, 
  User 
} from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
      color: 'text-blue-400'
    },
    {
      icon: Gamepad2,
      label: 'Games',
      path: '/games',
      color: 'text-green-400'
    },
    {
      icon: Wallet,
      label: 'Wallet',
      path: '/wallet',
      color: 'text-purple-400'
    },
    {
      icon: Trophy,
      label: 'Results',
      path: '/results',
      color: 'text-yellow-400'
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile-overview',
      color: 'text-pink-400'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map((item, index) => {
          const active = isActive(item.path);
          
          return (
            <motion.button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                active ? 'bg-gray-800/50' : 'hover:bg-gray-800/30'
              }`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <item.icon 
                  className={`w-6 h-6 ${
                    active ? item.color : 'text-gray-500'
                  } transition-colors duration-200`} 
                />
                {active && (
                  <motion.div
                    className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-current`}
                    layoutId="activeIndicator"
                    style={{ color: item.color.replace('text-', '') }}
                  />
                )}
              </div>
              <span 
                className={`text-xs mt-1 transition-colors duration-200 ${
                  active ? 'text-white' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;

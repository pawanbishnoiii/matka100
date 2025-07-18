
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ResponsiveNavigation from './ResponsiveNavigation';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { cn } from '@/lib/utils';

const ModernAppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        {/* Gaming Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gaming-blue/20 rounded-full filter blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gaming-purple/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gaming-cyan/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Responsive Navigation */}
        <ResponsiveNavigation notifications={3} />

        {/* Main Content */}
        <main className="relative z-10 min-h-screen pt-16 pb-24">
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
      </div>
    </ThemeProvider>
  );
};

export default ModernAppLayout;

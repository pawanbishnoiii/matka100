
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'blue' | 'purple' | 'green' | 'orange' | 'red';
}

export const PremiumCard = ({ children, className, hover = true, glow }: PremiumCardProps) => {
  const glowColors = {
    blue: "hover:shadow-blue-500/25",
    purple: "hover:shadow-purple-500/25",
    green: "hover:shadow-green-500/25",
    orange: "hover:shadow-orange-500/25",
    red: "hover:shadow-red-500/25"
  };

  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={cn(
        "bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl transition-all duration-300",
        hover && "hover:shadow-3xl hover:border-gray-600/50",
        glow && glowColors[glow],
        className
      )}
    >
      {children}
    </motion.div>
  );
};

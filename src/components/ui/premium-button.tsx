
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const PremiumButton = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  children, 
  className,
  onClick,
  disabled,
  type = 'button',
  ...props 
}: PremiumButtonProps) => {
  const baseClasses = "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700",
    secondary: "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-600",
    outline: "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    ghost: "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={loading || disabled}
      onClick={onClick}
      type={type}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
      )}
      {children}
    </motion.button>
  );
};

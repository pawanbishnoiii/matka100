
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumGlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  hover?: boolean;
  gradient?: boolean;
}

const variants = {
  default: 'bg-white/5 border border-white/10',
  elevated: 'bg-white/10 border border-white/20 shadow-2xl',
  outlined: 'bg-transparent border-2 border-white/30',
  filled: 'bg-white/15 border border-white/25'
};

const blurLevels = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl'
};

export const PremiumGlassCard: React.FC<PremiumGlassCardProps> = ({
  children,
  className,
  variant = 'default',
  blur = 'md',
  glow = false,
  hover = true,
  gradient = false,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        // Base styles
        'relative rounded-2xl p-6 transition-all duration-300',
        // Variant styles
        variants[variant],
        // Blur effect
        blurLevels[blur],
        // Glow effect
        glow && 'shadow-lg shadow-blue-500/20',
        // Gradient border
        gradient && 'before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:rounded-2xl before:content-[""] before:-z-10',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        y: -4, 
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      {...props}
    >
      {/* Gradient overlay for filled variant */}
      {gradient && (
        <div className="absolute inset-[1px] bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};


import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger' 
  | 'success' 
  | 'warning'
  | 'glass'
  | 'gradient';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface PremiumButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
  glow?: boolean;
  shimmer?: boolean;
  children: React.ReactNode;
}

const variants = {
  primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25',
  secondary: 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg hover:shadow-xl',
  outline: 'border-2 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white',
  ghost: 'bg-transparent text-gray-300 hover:bg-white/10 hover:text-white',
  danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25',
  success: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:shadow-green-500/25',
  warning: 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg hover:shadow-xl hover:shadow-yellow-500/25',
  glass: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl hover:bg-white/20',
  gradient: 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25'
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs font-medium rounded-lg',
  sm: 'px-3 py-2 text-sm font-medium rounded-lg',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl',
  lg: 'px-6 py-3 text-base font-semibold rounded-xl',
  xl: 'px-8 py-4 text-lg font-bold rounded-2xl'
};

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    fullWidth = false,
    glow = false,
    shimmer = false,
    children, 
    className,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 overflow-hidden group',
          // Variant styles
          variants[variant],
          // Size styles
          sizes[size],
          // Width
          fullWidth && 'w-full',
          // Glow effect
          glow && 'hover:shadow-2xl',
          // Disabled state
          isDisabled && 'opacity-50 cursor-not-allowed transform-none shadow-none',
          // Shimmer effect
          shimmer && 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
          className
        )}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Shimmer overlay */}
        {shimmer && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        )}
        
        {/* Left icon or loading spinner */}
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : LeftIcon ? (
          <LeftIcon className="w-4 h-4" />
        ) : null}
        
        {/* Button content */}
        <span className="relative z-10">
          {children}
        </span>
        
        {/* Right icon */}
        {!loading && RightIcon && (
          <RightIcon className="w-4 h-4" />
        )}
      </motion.button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

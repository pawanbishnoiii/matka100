
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  Play, 
  Trophy, 
  Users, 
  Zap, 
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-modern-button';
import { PremiumGlassCard } from '@/components/ui/premium-glass-card';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
  gradient: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 300 }}
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <PremiumGlassCard className="text-center p-6" variant="elevated" glow>
      <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <motion.div
        className="text-2xl font-bold text-white mb-1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.3, type: "spring", stiffness: 400 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-gray-400">{label}</div>
    </PremiumGlassCard>
  </motion.div>
);

export const ModernPremiumHero: React.FC = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [currentWinner, setCurrentWinner] = useState(0);

  const winners = [
    { name: "Raj Kumar", amount: "₹50,000", game: "Desawar" },
    { name: "Priya Singh", amount: "₹75,000", game: "Gali" },
    { name: "Amit Sharma", amount: "₹1,25,000", game: "Faridabad" },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Active Players", gradient: "from-blue-500 to-cyan-500" },
    { icon: Trophy, value: "₹2.5Cr", label: "Total Winnings", gradient: "from-yellow-500 to-orange-500" },
    { icon: Star, value: "4.8", label: "App Rating", gradient: "from-purple-500 to-pink-500" },
    { icon: Zap, value: "99.9%", label: "Uptime", gradient: "from-green-500 to-emerald-500" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWinner((prev) => (prev + 1) % winners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    });
  }, [controls]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Hero Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-white/20 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-white">India's #1 Matka Platform</span>
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Win Big with
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            MATKA 100
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Experience the thrill of premium Matka gaming with real-time results, 
          secure payments, and massive jackpots. Join thousands of winners today!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <PremiumButton
            variant="gradient"
            size="lg"
            leftIcon={Play}
            shimmer
            glow
            onClick={() => navigate('/games')}
            className="text-lg px-8 py-4"
          >
            Start Playing Now
          </PremiumButton>
          
          <PremiumButton
            variant="glass"
            size="lg"
            rightIcon={ArrowRight}
            onClick={() => navigate('/auth')}
            className="text-lg px-8 py-4"
          >
            Create Account
          </PremiumButton>
        </motion.div>

        {/* Live Winner Ticker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <PremiumGlassCard className="p-6 max-w-md mx-auto" variant="elevated" glow>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-400">LIVE WINNER</span>
            </div>
            <motion.div
              key={currentWinner}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="text-lg font-bold text-white">
                {winners[currentWinner].name}
              </div>
              <div className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {winners[currentWinner].amount}
              </div>
              <div className="text-sm text-gray-400">
                Won in {winners[currentWinner].game}
              </div>
            </motion.div>
          </PremiumGlassCard>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={1.2 + index * 0.1}
            />
          ))}
        </motion.div>
      </div>

      {/* Floating Animation Elements */}
      <motion.div
        animate={controls}
        className="absolute top-1/4 left-10 w-16 h-16 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-xl"
      />
      <motion.div
        animate={controls}
        style={{ animationDelay: '2s' }}
        className="absolute bottom-1/4 right-10 w-20 h-20 bg-gradient-to-r from-pink-500/30 to-yellow-500/30 rounded-full blur-xl"
      />
    </div>
  );
};

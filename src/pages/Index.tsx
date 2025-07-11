
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, Trophy, Users, TrendingUp, Crown, Zap, Shield, 
  Smartphone, CreditCard, Clock, Star, ChevronRight,
  Play, ArrowRight, CheckCircle, Globe, Award,
  Gamepad2, DollarSign, Timer, Target, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { PremiumGameShowcase } from '@/components/landing/PremiumGameShowcase';
import { OnboardingCarousel } from '@/components/landing/OnboardingCarousel';
import { TrustIndicators } from '@/components/landing/TrustIndicators';
import { LiveWinnerTicker } from '@/components/landing/LiveWinnerTicker';
import { AnimatedCounter } from '@/components/landing/AnimatedCounter';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    {
      title: "India's #1 Matka Platform",
      subtitle: "Premium Gaming Experience with Instant Payouts",
      image: "🎯",
      color: "from-blue-600 to-purple-600"
    },
    {
      title: "₹50L+ Daily Payouts",
      subtitle: "Join 10,000+ Winners Every Day",
      image: "💰",
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Instant UPI Withdrawals",
      subtitle: "Get Your Winnings in 2 Minutes",
      image: "⚡",
      color: "from-orange-600 to-red-600"
    }
  ];

  const stats = [
    { icon: Users, label: 'Active Players', value: 15000, suffix: '+', color: 'text-blue-400' },
    { icon: Trophy, label: 'Daily Winners', value: 850, suffix: '+', color: 'text-yellow-400' },
    { icon: Coins, label: 'Daily Payout', value: 75, suffix: 'L+', prefix: '₹', color: 'text-green-400' },
    { icon: TrendingUp, label: 'Win Rate', value: 97, suffix: '%', color: 'text-red-400' }
  ];

  const features = [
    {
      icon: Zap,
      title: "Instant Withdrawals",
      description: "Get your winnings in UPI/Bank within 2 minutes",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Trophy,
      title: "Highest Payouts",
      description: "Best rates in the market with guaranteed payments",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "100% Secure",
      description: "Bank-grade security with SSL encryption",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimized for mobile with app-like experience",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const paymentMethods = [
    { name: 'UPI', logo: '📱', color: 'bg-green-500' },
    { name: 'Razorpay', logo: '💳', color: 'bg-blue-500' },
    { name: 'Bank Transfer', logo: '🏦', color: 'bg-indigo-500' },
    { name: 'USDT TRC-20', logo: '₿', color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 font-satoshi">
      {/* Premium Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card-premium border-b border-gray-700/50 p-4 sticky top-0 z-50"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent hindi-font">
                Matka100
              </h1>
              <p className="text-xs text-gray-400 font-medium">Premium Gaming Platform</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className="hidden md:block text-right glass-card px-4 py-2 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-gray-400">IST Time</p>
              <p className="font-mono text-green-400 font-bold">
                {currentTime.toLocaleTimeString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  hour12: true
                })}
              </p>
            </motion.div>
            
            {user ? (
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="glass-card px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-400">Welcome</p>
                  <p className="font-semibold text-white">{user.email}</p>
                </div>
                {isAdmin && (
                  <Button 
                    onClick={() => window.location.href = '/admin'}
                    className="gradient-cyber text-white font-semibold hover:scale-105 transition-transform"
                  >
                    Admin Panel
                  </Button>
                )}
              </motion.div>
            ) : (
              <Button 
                onClick={() => setAuthModalOpen(true)}
                className="neon-glow gradient-matka text-white font-semibold hover:scale-105 transition-transform"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Playing
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Premium Hero Section with Onboarding Carousel */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <OnboardingCarousel slides={heroSlides} />
          
          {/* Live Stats */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="glass-card-premium p-6 rounded-xl hover-lift text-center"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-white mb-1">
                  <AnimatedCounter 
                    value={stat.value} 
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium Game Showcase */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Live Games
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Choose from 13+ Premium Matka Games
            </p>
          </motion.div>
          
          <PremiumGameShowcase />
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-premium rounded-2xl p-6 hover-lift text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Indicators */}
      <TrustIndicators paymentMethods={paymentMethods} />

      {/* Live Winner Ticker */}
      <LiveWinnerTicker />

      {/* Call to Action */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card-premium rounded-2xl p-12 max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Ready to Win Big?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of winners on India's most trusted Matka platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setAuthModalOpen(true)}
                className="gradient-matka text-white font-semibold px-8 py-4 text-lg hover:scale-105 transition-transform neon-glow"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Playing Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                className="glass-card border-gray-600 text-white hover:bg-gray-700/50 px-8 py-4 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="glass-card border-t border-gray-700/50 mt-8 p-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
                  <Crown className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white">Matka100</h3>
              </div>
              <p className="text-gray-400 mb-4">India's most trusted Matka gaming platform with instant payouts and premium experience.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How to Play</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Results</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Wallet</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Payment Methods</h4>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method, index) => (
                  <div key={index} className={`${method.color} p-2 rounded text-white text-sm text-center`}>
                    {method.logo} {method.name}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Security</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">SSL Secured</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">RNG Certified</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p className="mb-2">© 2024 Matka100. All rights reserved.</p>
            <p className="text-sm">Play Responsibly. 18+ Only. Gambling can be addictive.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Index;


import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Shield, Zap, Award, TrendingUp, Sparkles } from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard } from '@/components/ui/premium-card';

export const ModernHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-[32rem] h-[32rem] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-full px-8 py-4 mb-8"
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              India's Most Trusted Matka Platform
            </span>
            <Star className="w-6 h-6 text-yellow-400" />
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black mb-4 leading-none">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                MATKA
              </span>
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent block">
                PREMIUM
              </span>
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-300 mt-4">
              Where Fortune Meets Technology
            </p>
          </motion.div>

          {/* Hero Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Experience the future of Matka gaming with 
            <span className="text-blue-400 font-semibold"> real-time results</span>, 
            <span className="text-purple-400 font-semibold"> instant payouts</span>, and 
            <span className="text-green-400 font-semibold"> 24/7 support</span>.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            <PremiumCard glow="blue" className="text-center">
              <TrendingUp className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-sm text-gray-400">Active Players</div>
            </PremiumCard>

            <PremiumCard glow="purple" className="text-center">
              <Award className="w-10 h-10 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">₹10Cr+</div>
              <div className="text-sm text-gray-400">Total Payouts</div>
            </PremiumCard>

            <PremiumCard glow="green" className="text-center">
              <Zap className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">13+</div>
              <div className="text-sm text-gray-400">Live Games</div>
            </PremiumCard>

            <PremiumCard glow="orange" className="text-center">
              <Shield className="w-10 h-10 text-orange-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-sm text-gray-400">Secure</div>
            </PremiumCard>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <PremiumButton size="lg" className="text-xl px-12 py-6 group">
              <Play className="w-6 h-6 mr-3 group-hover:animate-pulse" />
              Start Playing Now
            </PremiumButton>
            
            <PremiumButton variant="outline" size="lg" className="text-xl px-12 py-6">
              View Live Games
            </PremiumButton>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6" />
              <span>Instant Payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6" />
              <span>Licensed Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-2 h-4 bg-white/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};

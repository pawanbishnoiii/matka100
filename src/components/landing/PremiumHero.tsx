
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Shield, Zap, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedCounter } from './AnimatedCounter';

export const PremiumHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Hero Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8"
          >
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-white/90">India's #1 Premium Matka Platform</span>
            <Zap className="w-5 h-5 text-blue-400" />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-7xl lg:text-8xl font-bold mb-6 leading-none"
          >
            <span className="heading-premium block">MATKA</span>
            <span className="text-accent-gradient block">PREMIUM</span>
            <span className="text-white/80 text-2xl md:text-4xl lg:text-5xl font-normal block mt-2">
              Ultimate Gaming Experience
            </span>
          </motion.h1>

          {/* Hero Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Experience the thrill of traditional Matka with modern technology. 
            <span className="text-gradient font-semibold"> Real-time results</span>, 
            <span className="text-accent-gradient font-semibold"> instant payouts</span>, and 
            <span className="text-gradient font-semibold"> 24/7 support</span>.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            <div className="premium-card p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">
                <AnimatedCounter value={50000} suffix="+" duration={2} />
              </div>
              <div className="text-sm text-white/60">Active Players</div>
            </div>

            <div className="premium-card p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-accent-gradient mb-1">
                <AnimatedCounter value={10} prefix="₹" suffix="Cr+" duration={2} />
              </div>
              <div className="text-sm text-white/60">Total Payouts</div>
            </div>

            <div className="premium-card p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">
                <AnimatedCounter value={13} suffix="+" duration={2} />
              </div>
              <div className="text-sm text-white/60">Live Games</div>
            </div>

            <div className="premium-card p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">
                100%
              </div>
              <div className="text-sm text-white/60">Secure & Safe</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              className="btn-premium text-lg px-8 py-4 group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Start Playing Now
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4 backdrop-blur-xl"
            >
              View Live Games
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/40"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Instant Payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span className="text-sm">Licensed Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span className="text-sm">24/7 Support</span>
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
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};

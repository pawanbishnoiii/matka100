
import React from 'react';
import { motion } from 'framer-motion';
import { ModernPremiumHero } from '@/components/landing/ModernPremiumHero';
import { GameShowcase } from '@/components/landing/GameShowcase';
import { TrustIndicators } from '@/components/landing/TrustIndicators';
import { LiveWinnerTicker } from '@/components/landing/LiveWinnerTicker';
import { PayoutCalculator } from '@/components/landing/PayoutCalculator';
import BottomNavigation from '@/components/layout/BottomNavigation';
import LiveStatistics from '@/components/stats/LiveStatistics';

const ModernIndex = () => {
  // Payment methods data for TrustIndicators
  const paymentMethods = [
    { name: 'UPI', logo: '📱', color: 'bg-blue-600' },
    { name: 'PhonePe', logo: '💜', color: 'bg-purple-600' },
    { name: 'Google Pay', logo: '🟢', color: 'bg-green-600' },
    { name: 'Paytm', logo: '🔵', color: 'bg-blue-500' },
    { name: 'Bank Transfer', logo: '🏦', color: 'bg-gray-600' },
    { name: 'USDT TRC20', logo: '₮', color: 'bg-green-500' }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <ModernPremiumHero />
        </section>

        {/* Live Statistics Section */}
        <section className="px-4 py-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-white hindi-font mb-2">
                Live Platform Statistics
              </h2>
              <p className="text-gray-400">Real-time updates every 3 seconds</p>
            </motion.div>
            
            <LiveStatistics />
          </div>
        </section>

        {/* Live Winners Ticker */}
        <section className="py-4">
          <LiveWinnerTicker />
        </section>

        {/* Games Showcase */}
        <section className="px-4 py-12">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white hindi-font mb-4">
                Popular Games
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Experience the thrill of our most popular satta matka games with real-time results
              </p>
            </motion.div>
            
            <GameShowcase />
          </div>
        </section>

        {/* Payout Calculator */}
        <section className="px-4 py-12 bg-black/20">
          <div className="container mx-auto">
            <PayoutCalculator />
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="px-4 py-12">
          <div className="container mx-auto">
            <TrustIndicators paymentMethods={paymentMethods} />
          </div>
        </section>

        {/* Bottom padding for mobile navigation */}
        <div className="h-20 md:h-0"></div>
      </div>
      <BottomNavigation />
    </>
  );
};

export default ModernIndex;

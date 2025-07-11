
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ModernHero } from '@/components/landing/ModernHero';
import { GameShowcase } from '@/components/landing/GameShowcase';
import { PayoutCalculator } from '@/components/landing/PayoutCalculator';
import { LiveWinnerTicker } from '@/components/landing/LiveWinnerTicker';
import { TrustIndicators } from '@/components/landing/TrustIndicators';
import { ModernAuthModal } from '@/components/auth/ModernAuthModal';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PremiumButton } from '@/components/ui/premium-button';
import { LogIn, UserPlus } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Loading Matka Premium...
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to appropriate dashboard
  if (user) {
    return <Navigate to="/games-list" replace />;
  }

  // Payment methods for trust indicators
  const paymentMethods = [
    { name: "UPI", logo: "📱", color: "bg-green-600" },
    { name: "Razorpay", logo: "💳", color: "bg-blue-600" },
    { name: "Bank Transfer", logo: "🏦", color: "bg-purple-600" },
    { name: "USDT TRC20", logo: "₿", color: "bg-orange-600" }
  ];

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      {/* Live Winner Ticker */}
      <LiveWinnerTicker />
      
      {/* Premium Hero Section */}
      <ModernHero />
      
      {/* Game Showcase */}
      <GameShowcase />
      
      {/* Payout Calculator */}
      <PayoutCalculator />
      
      {/* Auth CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ready to Start Winning?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of players who trust Matka Premium for their gaming experience. 
              Sign up now and get started with just ₹10!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PremiumButton
                size="lg"
                onClick={() => setAuthModalOpen(true)}
                className="text-xl px-8 py-4"
              >
                <UserPlus className="w-6 h-6 mr-2" />
                Create Account
              </PremiumButton>
              <PremiumButton
                variant="outline"
                size="lg"
                onClick={() => setAuthModalOpen(true)}
                className="text-xl px-8 py-4"
              >
                <LogIn className="w-6 h-6 mr-2" />
                Sign In
              </PremiumButton>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Trust Indicators */}
      <TrustIndicators paymentMethods={paymentMethods} />

      {/* Auth Modal */}
      <ModernAuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Index;


import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PremiumHero } from '@/components/landing/PremiumHero';
import { GameShowcase } from '@/components/landing/GameShowcase';
import { PayoutCalculator } from '@/components/landing/PayoutCalculator';
import { AuthSection } from '@/components/landing/AuthSection';
import { TrustIndicators } from '@/components/landing/TrustIndicators';
import { LiveWinnerTicker } from '@/components/landing/LiveWinnerTicker';
import { PremiumGameShowcase } from '@/components/landing/PremiumGameShowcase';
import { OnboardingCarousel } from '@/components/landing/OnboardingCarousel';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-premium flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gradient">Loading...</div>
        </div>
      </div>
    );
  }

  // If user is logged in, redirect to appropriate dashboard
  if (user) {
    return <Navigate to="/games-list" replace />;
  }

  // Onboarding carousel slides
  const onboardingSlides = [
    {
      title: "Welcome to Matka Premium",
      subtitle: "India's most trusted Matka platform",
      image: "🎯",
      color: "from-blue-600 to-purple-600"
    },
    {
      title: "Real-time Results",
      subtitle: "Get instant game results and payouts",
      image: "⚡",
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Secure Payments",
      subtitle: "Multiple payment options with instant withdrawals",
      image: "🔒",
      color: "from-green-600 to-blue-600"
    },
    {
      title: "24/7 Support",
      subtitle: "Round the clock customer support",
      image: "🎯",
      color: "from-orange-600 to-red-600"
    }
  ];

  // Payment methods for trust indicators
  const paymentMethods = [
    { name: "UPI", logo: "📱", color: "bg-green-600" },
    { name: "Razorpay", logo: "💳", color: "bg-blue-600" },
    { name: "Bank Transfer", logo: "🏦", color: "bg-purple-600" },
    { name: "USDT TRC20", logo: "₿", color: "bg-orange-600" }
  ];

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-premium">
      {/* Live Winner Ticker */}
      <LiveWinnerTicker />
      
      {/* Premium Hero Section */}
      <PremiumHero />
      
      {/* Game Showcase */}
      <GameShowcase />
      
      {/* Premium Game Features */}
      <PremiumGameShowcase />
      
      {/* Payout Calculator */}
      <PayoutCalculator />
      
      {/* Onboarding Carousel */}
      <OnboardingCarousel slides={onboardingSlides} />
      
      {/* Authentication Section */}
      <AuthSection />
      
      {/* Trust Indicators */}
      <TrustIndicators paymentMethods={paymentMethods} />
    </div>
  );
};

export default Index;

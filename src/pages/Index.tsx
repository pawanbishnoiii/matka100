
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
      <OnboardingCarousel />
      
      {/* Authentication Section */}
      <AuthSection />
      
      {/* Trust Indicators */}
      <TrustIndicators />
    </div>
  );
};

export default Index;

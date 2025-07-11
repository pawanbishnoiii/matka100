import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Trophy, 
  Users, 
  Wallet, 
  User,
  Menu,
  X,
  Crown,
  Sparkles,
  TrendingUp,
  Gamepad2,
  History,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ModernHero } from '@/components/landing/ModernHero';
import { GameShowcase } from '@/components/landing/GameShowcase';
import { PayoutCalculator } from '@/components/landing/PayoutCalculator';
import { TrustIndicators } from '@/components/landing/TrustIndicators';
import { PremiumGameShowcase } from '@/components/landing/PremiumGameShowcase';

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigationItems = [
    { label: 'Games', icon: Gamepad2, path: '/games-list' },
    { label: 'Results', icon: Trophy, path: '/results' },
    { label: 'Wallet', icon: Wallet, path: '/wallet' },
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'History', icon: History, path: '/results' },
    { label: 'Help', icon: HelpCircle, path: '/profile' }
  ];

  const paymentMethods = [
    { name: 'UPI', logo: '📱', color: 'bg-blue-600' },
    { name: 'Razorpay', logo: '💳', color: 'bg-purple-600' },
    { name: 'Bank Transfer', logo: '🏦', color: 'bg-green-600' },
    { name: 'USDT TRC-20', logo: '₿', color: 'bg-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Navigation Header */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-card border-b border-gray-700/50 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white hindi-font">Matka Pro</h1>
                <p className="text-xs text-gray-400">Premium Gaming</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
              
              {!user ? (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="neon-glow bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Login / Sign Up
                </Button>
              ) : (
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                  Welcome, {user.email?.split('@')[0]}
                </Badge>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-700/50"
            >
              <div className="container mx-auto px-4 py-4 space-y-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full text-left text-gray-300 hover:text-white transition-colors py-2"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
                
                {!user ? (
                  <Button 
                    onClick={() => {
                      navigate('/auth');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full neon-glow bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Login / Sign Up
                  </Button>
                ) : (
                  <div className="py-2">
                    <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                      Welcome, {user.email?.split('@')[0]}
                    </Badge>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <ModernHero />

      {/* Quick Actions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { label: 'Play Games', icon: Play, path: '/games-list', color: 'from-green-600 to-emerald-600' },
              { label: 'View Results', icon: Trophy, path: '/results', color: 'from-yellow-600 to-orange-600' },
              { label: 'Wallet', icon: Wallet, path: '/wallet', color: 'from-blue-600 to-purple-600' },
              { label: 'Profile', icon: User, path: '/profile', color: 'from-purple-600 to-pink-600' }
            ].map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className="glass-card border-gray-700 hover:neon-glow transition-all cursor-pointer"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white font-semibold">{action.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium Game Showcase */}
      <PremiumGameShowcase />

      {/* Game Showcase */}
      <GameShowcase />

      {/* Payout Calculator */}
      <PayoutCalculator />

      {/* Trust Indicators */}
      <TrustIndicators paymentMethods={paymentMethods} />

      {/* Trending Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-8 h-8 text-yellow-400" />
              <h2 className="text-4xl font-bold text-white hindi-font">Trending Now</h2>
            </div>
            <p className="text-gray-300 text-lg">Live numbers and trending games</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { number: '245', game: 'Main Mumbai', status: 'Live' },
              { number: '678', game: 'Delhi Bazaar', status: 'Result' },
              { number: '123', game: 'Kalyan Night', status: 'Opening Soon' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card border-gray-700 p-6 text-center hover:neon-glow transition-all"
              >
                <div className="text-4xl font-bold text-yellow-400 mb-2">{item.number}</div>
                <div className="text-white font-semibold mb-2">{item.game}</div>
                <Badge className={`${
                  item.status === 'Live' ? 'bg-green-600/20 text-green-400' :
                  item.status === 'Result' ? 'bg-blue-600/20 text-blue-400' :
                  'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {item.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-700/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold text-white hindi-font">Matka Pro</span>
          </div>
          <p className="text-gray-400 mb-4">Premium Gaming Experience - Play Responsibly</p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <button onClick={() => navigate('/games-list')} className="hover:text-white transition-colors">Games</button>
            <button onClick={() => navigate('/results')} className="hover:text-white transition-colors">Results</button>
            <button onClick={() => navigate('/profile')} className="hover:text-white transition-colors">Help & Support</button>
            <span>Terms & Conditions</span>
            <span>Privacy Policy</span>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>© 2025 Matka Pro. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

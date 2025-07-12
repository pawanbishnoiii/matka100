
import React from 'react';
import { motion } from 'framer-motion';
import { ModernPremiumHero } from '@/components/landing/ModernPremiumHero';
import { PremiumGlassCard } from '@/components/ui/premium-glass-card';
import { PremiumButton } from '@/components/ui/premium-modern-button';
import { 
  Shield, 
  Zap, 
  Trophy, 
  Users,
  Clock,
  CreditCard,
  Star,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ModernIndex: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Bank-grade security with encrypted transactions",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Real-time game results and instant payouts",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: Trophy,
      title: "Huge Jackpots",
      description: "Win up to ₹10 Lakhs with single bet",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Users,
      title: "50K+ Players",
      description: "Join India's largest Matka community",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: Clock,
      title: "24/7 Gaming",
      description: "Play anytime with multiple game sessions",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: CreditCard,
      title: "Easy Payments",
      description: "UPI, Bank Transfer, and Crypto support",
      gradient: "from-teal-500 to-green-600"
    }
  ];

  const games = [
    { name: "Desawar", time: "05:00 AM", status: "Live", players: "2.5K" },
    { name: "Gali", time: "11:00 AM", status: "Live", players: "1.8K" },
    { name: "Faridabad", time: "06:00 PM", status: "Upcoming", players: "3.2K" },
    { name: "Ghaziabad", time: "08:00 PM", status: "Upcoming", players: "2.1K" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ModernPremiumHero />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why Choose MATKA 100?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Experience premium Matka gaming with cutting-edge technology and unmatched security
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PremiumGlassCard className="p-6 h-full" variant="elevated" hover glow>
                  <div className={`w-12 h-12 mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </PremiumGlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Games Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Live Games Today
            </h2>
            <p className="text-lg text-gray-400">
              Join thousands of players in today's hottest games
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {games.map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PremiumGlassCard className="p-6 text-center" variant="elevated" hover>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      game.status === 'Live' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {game.status}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="w-3 h-3" />
                      {game.players}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{game.time}</p>
                  <PremiumButton 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    onClick={() => navigate('/games')}
                  >
                    Play Now
                  </PremiumButton>
                </PremiumGlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <PremiumButton
              variant="gradient"
              size="lg"
              rightIcon={ArrowRight}
              onClick={() => navigate('/games')}
              shimmer
              glow
            >
              View All Games
            </PremiumButton>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              What Players Say
            </h2>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-400">4.8/5 from 10,000+ reviews</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Rajesh Kumar",
                text: "Best Matka app I've used. Instant payouts and great customer support!",
                amount: "₹2,50,000",
                location: "Delhi"
              },
              {
                name: "Priya Singh",
                text: "Won multiple times here. The app is super fast and reliable.",
                amount: "₹1,80,000",
                location: "Mumbai"
              },
              {
                name: "Amit Sharma",
                text: "Amazing experience! Quick deposits and withdrawals every time.",
                amount: "₹3,20,000",
                location: "Pune"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <PremiumGlassCard className="p-6" variant="elevated" hover>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.location}</div>
                    <div className="text-green-400 font-bold mt-2">
                      Won {testimonial.amount}
                    </div>
                  </div>
                </PremiumGlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Win Big?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of winners and start your journey to massive jackpots today. 
              Sign up now and get ₹100 bonus!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PremiumButton
                variant="gradient"
                size="xl"
                onClick={() => navigate('/auth')}
                shimmer
                glow
                className="px-12"
              >
                Start Playing - Get ₹100 Bonus
              </PremiumButton>
              <PremiumButton
                variant="glass"
                size="xl"
                onClick={() => navigate('/help')}
                className="px-12"
              >
                Learn How to Play
              </PremiumButton>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ModernIndex;

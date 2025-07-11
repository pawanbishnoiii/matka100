
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Crown, Star, TrendingUp } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';

export const GameShowcase = () => {
  const games = [
    {
      name: "Single Ank",
      description: "Pick a single digit and win 10x your bet",
      multiplier: "10x",
      icon: Target,
      color: "blue",
      popular: false
    },
    {
      name: "Jodi",
      description: "Match the 2-digit combination for 90x payout",
      multiplier: "90x",
      icon: Zap,
      color: "purple",
      popular: true
    },
    {
      name: "Single Patti",
      description: "3-digit single patti with 140x multiplier",
      multiplier: "140x",
      icon: Crown,
      color: "orange",
      popular: false
    },
    {
      name: "Double Patti",
      description: "Double digit patti for massive 280x returns",
      multiplier: "280x",
      icon: Star,
      color: "green",
      popular: true
    },
    {
      name: "Triple Patti",
      description: "Ultimate challenge with 600x mega payout",
      multiplier: "600x",
      icon: TrendingUp,
      color: "red",
      popular: false
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Premium Games
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose from our exciting range of Matka games with guaranteed payouts and instant results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <PremiumCard 
                glow={game.color as any} 
                className="relative h-full group cursor-pointer"
              >
                {game.popular && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <game.icon className={`w-12 h-12 text-${game.color}-400`} />
                  <div className={`text-2xl font-bold text-${game.color}-400`}>
                    {game.multiplier}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{game.name}</h3>
                <p className="text-gray-300 mb-6">{game.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Min Bet: ₹10</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">4.8</span>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

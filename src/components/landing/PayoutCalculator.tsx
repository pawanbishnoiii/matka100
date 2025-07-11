
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumButton } from '@/components/ui/premium-button';

export const PayoutCalculator = () => {
  const [betAmount, setBetAmount] = useState('100');
  const [gameType, setGameType] = useState('jodi');

  const multipliers = {
    single_ank: 10,
    jodi: 90,
    single_patti: 140,
    double_patti: 280,
    triple_patti: 600
  };

  const calculatePayout = () => {
    const amount = parseFloat(betAmount) || 0;
    const multiplier = multipliers[gameType as keyof typeof multipliers];
    return amount * multiplier;
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Payout Calculator
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Calculate your potential winnings before placing your bet
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <PremiumCard glow="green" className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Calculator className="w-8 h-8 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Calculate Winnings</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Game Type
                </label>
                <select
                  value={gameType}
                  onChange={(e) => setGameType(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="single_ank">Single Ank (10x)</option>
                  <option value="jodi">Jodi (90x)</option>
                  <option value="single_patti">Single Patti (140x)</option>
                  <option value="double_patti">Double Patti (280x)</option>
                  <option value="triple_patti">Triple Patti (600x)</option>
                </select>
              </div>

              <PremiumInput
                label="Bet Amount (₹)"
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Enter bet amount"
                min="10"
                max="10000"
              />

              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 mb-2">Potential Payout</p>
                    <p className="text-4xl font-bold text-green-400">
                      ₹{calculatePayout().toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-400" />
                </div>
                <div className="mt-4 pt-4 border-t border-green-500/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bet Amount:</span>
                    <span className="text-white">₹{betAmount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-400">Multiplier:</span>
                    <span className="text-green-400">{multipliers[gameType as keyof typeof multipliers]}x</span>
                  </div>
                </div>
              </div>

              <PremiumButton className="w-full" size="lg">
                Place This Bet
              </PremiumButton>
            </div>
          </PremiumCard>
        </motion.div>
      </div>
    </section>
  );
};

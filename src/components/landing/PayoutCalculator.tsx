
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Zap, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const PayoutCalculator = () => {
  const [betAmount, setBetAmount] = useState<string>('100');
  const [betType, setBetType] = useState<string>('single_ank');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const multipliers = {
    single_ank: 10,
    jodi: 90,
    single_patti: 140,
    double_patti: 280,
    triple_patti: 600
  };

  const betTypes = [
    { value: 'single_ank', label: 'Single Ank', description: 'Single digit (0-9)' },
    { value: 'jodi', label: 'Jodi', description: 'Two digit pair' },
    { value: 'single_patti', label: 'Single Patti', description: 'Three digit single' },
    { value: 'double_patti', label: 'Double Patti', description: 'Three digit double' },
    { value: 'triple_patti', label: 'Triple Patti', description: 'Three digit triple' }
  ];

  const calculatePayout = () => {
    const amount = parseFloat(betAmount) || 0;
    const multiplier = multipliers[betType as keyof typeof multipliers];
    return amount * multiplier;
  };

  const quickAmounts = [50, 100, 500, 1000, 5000];

  return (
    <section className="py-20 bg-gradient-to-b from-black/20 to-transparent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold heading-premium mb-6">
            Payout Calculator
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Calculate your potential winnings with our 
            <span className="text-gradient font-semibold"> interactive calculator</span>
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gradient">
                    <Calculator className="w-6 h-6" />
                    Calculate Your Winnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Bet Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Select Bet Type
                    </label>
                    <Select value={betType} onValueChange={setBetType}>
                      <SelectTrigger className="bg-black/20 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {betTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-white/60">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bet Amount */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Bet Amount (₹)
                    </label>
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="bg-black/20 border-white/20 text-white"
                      placeholder="Enter amount"
                      min="10"
                      max="50000"
                    />
                  </div>

                  {/* Quick Amount Buttons */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Quick Select
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setBetAmount(amount.toString())}
                          className={`bg-white/5 border-white/20 text-white hover:bg-white/10 ${
                            betAmount === amount.toString() ? 'bg-blue-600/20 border-blue-400' : ''
                          }`}
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Multiplier Info */}
                  <div className="p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Multiplier:</span>
                      <span className="text-2xl font-bold text-gradient">
                        {multipliers[betType as keyof typeof multipliers]}x
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Display */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Payout Result */}
              <Card className="premium-card neon-glow">
                <CardContent className="p-8 text-center">
                  <div className="mb-4">
                    <DollarSign className="w-12 h-12 mx-auto text-green-400 mb-2" />
                    <h3 className="text-2xl font-bold text-white mb-2">Potential Payout</h3>
                  </div>
                  <div className="text-5xl font-bold text-gradient mb-2">
                    ₹{calculatePayout().toLocaleString()}
                  </div>
                  <div className="text-white/60">
                    from ₹{betAmount} bet
                  </div>
                </CardContent>
              </Card>

              {/* Profit Calculation */}
              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h4 className="text-lg font-semibold text-white">Profit Breakdown</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Bet Amount:</span>
                      <span className="text-red-400 font-semibold">-₹{betAmount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Total Payout:</span>
                      <span className="text-green-400 font-semibold">+₹{calculatePayout().toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Net Profit:</span>
                        <span className="text-2xl font-bold text-gradient">
                          +₹{(calculatePayout() - parseFloat(betAmount || '0')).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Rate Info */}
              <Card className="premium-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-lg font-semibold text-white">Winning Odds</h4>
                  </div>
                  <div className="text-sm text-white/70 leading-relaxed">
                    <p className="mb-2">
                      <span className="font-semibold text-gradient">{betTypes.find(t => t.value === betType)?.label}</span> 
                      {' '}has different winning probabilities based on the game type and number selection.
                    </p>
                    <p className="text-yellow-400 font-medium">
                      Higher multipliers = Lower winning probability
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

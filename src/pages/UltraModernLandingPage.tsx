
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Zap, Trophy, Star, TrendingUp, Download, Phone, Mail, MapPin, Crown, Sparkles, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

// Enhanced Indian Female Mascot Component
const EnhancedIndianMascot = () => (
  <motion.div
    className="fixed top-20 right-4 z-50 hidden lg:block"
    initial={{ opacity: 0, x: 100, rotate: -10 }}
    animate={{ opacity: 1, x: 0, rotate: 0 }}
    transition={{ delay: 1.5, duration: 1.2, type: "spring" }}
  >
    <motion.div
      className="relative cursor-pointer group"
      animate={{ 
        y: [0, -12, 0],
        rotate: [0, 3, -3, 0],
        scale: [1, 1.02, 1]
      }}
      transition={{ 
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      {/* Enhanced Mascot Figure */}
      <div className="w-28 h-36 relative">
        {/* Main Body */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-400 via-red-500 to-pink-600 rounded-full opacity-95 shadow-2xl"></div>
        {/* Head */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-b from-yellow-300 via-orange-400 to-red-500 rounded-full shadow-lg"></div>
        {/* Saree with Pattern */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-pink-500 via-purple-600 to-indigo-700 rounded-b-full opacity-90 shadow-lg"></div>
        {/* Decorative Elements */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-300 rounded-full shadow-md animate-pulse"></div>
        {/* Magical Glowing Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-pink-500/30 rounded-full blur-2xl animate-pulse"></div>
        {/* Sparkle Effects */}
        <motion.div
          className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-300 rounded-full"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="absolute -bottom-1 -left-2 w-1.5 h-1.5 bg-pink-400 rounded-full"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
        />
        <motion.div
          className="absolute top-1/2 -right-3 w-1 h-1 bg-orange-400 rounded-full"
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
        />
      </div>
      
      {/* Enhanced Speech Bubble with Animation */}
      <motion.div
        className="absolute -left-56 top-8 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white p-4 rounded-2xl shadow-2xl border border-white/20"
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.7, type: "spring" }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
        >
          <p className="text-sm font-bold flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-300" />
            जीतने का समय! 🎰
          </p>
          <p className="text-xs text-white/90 mt-1">Win Big Today!</p>
        </motion.div>
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-12 border-l-purple-600 border-t-6 border-b-6 border-t-transparent border-b-transparent"></div>
        
        {/* Floating particles around bubble */}
        <motion.div
          className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full"
          animate={{ 
            x: [0, 5, -5, 0],
            y: [0, -5, 5, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  </motion.div>
);

// Ultra Enhanced Wheel Spinner Component
const UltraWheelSpinner = () => (
  <motion.div
    className="relative w-40 h-40 mx-auto"
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ duration: 1.2, type: "spring" }}
  >
    {/* Outer Ring */}
    <motion.div
      className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 via-pink-500 to-purple-600 p-2 shadow-2xl"
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    >
      {/* Inner Ring */}
      <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-900 via-gray-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        {/* Center Content */}
        <motion.div
          className="text-center z-10"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            🎰
          </div>
          <div className="text-xs font-bold text-yellow-400 mt-1">SPIN</div>
        </motion.div>
        
        {/* Decorative segments */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-8 bg-gradient-to-t from-yellow-400 to-transparent"
            style={{
              top: '10px',
              left: '50%',
              transformOrigin: '50% 70px',
              transform: `rotate(${i * 45}deg) translateX(-50%)`,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
    
    {/* Glow Effect */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 via-red-500/30 to-purple-600/30 blur-3xl animate-pulse"></div>
    
    {/* Sparkle Effects */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-yellow-300 rounded-full"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: i * 0.3,
        }}
      />
    ))}
  </motion.div>
);

// Enhanced Live Payout Ticker Component
const EnhancedLivePayoutTicker = () => {
  const [payouts] = useState([
    { user: "राज***", amount: "₹25,000", game: "कल्याण मटका", time: "2 min ago" },
    { user: "प्रिया***", amount: "₹15,500", game: "मिलन डे", time: "5 min ago" },
    { user: "अर्जुन***", amount: "₹42,000", game: "राजधानी नाइट", time: "8 min ago" },
    { user: "श्रुति***", amount: "₹8,200", game: "टाइम बाजार", time: "12 min ago" },
  ]);

  return (
    <motion.div
      className="bg-gradient-to-r from-green-900/40 via-emerald-900/40 to-green-900/40 border border-green-500/50 rounded-2xl p-6 overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-400/20 to-transparent"></div>
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative">
        <motion.h3 
          className="text-green-400 font-bold text-xl mb-4 flex items-center gap-3"
          animate={{ 
            textShadow: [
              '0 0 5px rgba(34, 197, 94, 0.5)',
              '0 0 20px rgba(34, 197, 94, 0.8)',
              '0 0 5px rgba(34, 197, 94, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <TrendingUp className="w-6 h-6" />
          </motion.div>
          Live Winners 🔥
          <motion.div
            className="flex gap-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4" />
            <Flame className="w-4 h-4" />
          </motion.div>
        </motion.h3>
        
        <div className="space-y-3">
          {payouts.map((payout, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 + 1 }}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  🎯
                </motion.div>
                <div>
                  <p className="text-white font-bold text-lg">{payout.user}</p>
                  <p className="text-gray-400 text-sm">{payout.game}</p>
                  <p className="text-green-400 text-xs">{payout.time}</p>
                </div>
              </div>
              <motion.div
                className="text-right"
                whileHover={{ scale: 1.1 }}
              >
                <p className="text-green-400 font-bold text-xl">{payout.amount}</p>
                <motion.p
                  className="text-yellow-400 text-xs font-semibold"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💰 WINNER
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Real-time Results Bar Component
const EnhancedRealTimeResults = () => {
  const [results] = useState([
    { game: "कल्याण", result: "245", time: "3:45 PM", status: "DECLARED" },
    { game: "मिलन", result: "678", time: "4:45 PM", status: "COMING" },
    { game: "राजधानी", result: "134", time: "5:45 PM", status: "LIVE" },
  ]);

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/50 rounded-2xl p-6 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))',
            'linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3))',
            'linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3))',
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative">
        <motion.h3 
          className="text-blue-400 font-bold text-xl mb-6 flex items-center gap-3"
          animate={{ 
            textShadow: [
              '0 0 5px rgba(59, 130, 246, 0.5)',
              '0 0 20px rgba(59, 130, 246, 0.8)',
              '0 0 5px rgba(59, 130, 246, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap className="w-6 h-6" />
          </motion.div>
          Latest Results ⚡
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((result, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-6 text-center border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3 + 1.2 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
            >
              {/* Status Indicator */}
              <motion.div
                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                  result.status === 'DECLARED' ? 'bg-green-600 text-white' :
                  result.status === 'LIVE' ? 'bg-red-600 text-white animate-pulse' :
                  'bg-yellow-600 text-white'
                }`}
                animate={result.status === 'LIVE' ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {result.status}
              </motion.div>

              <motion.p 
                className="text-white font-bold text-4xl mb-2"
                animate={{ 
                  scale: [1, 1.1, 1],
                  color: [
                    'rgb(255, 255, 255)',
                    'rgb(34, 197, 94)',
                    'rgb(255, 255, 255)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                {result.result}
              </motion.p>
              <p className="text-gray-300 text-lg font-semibold">{result.game}</p>
              <p className="text-blue-400 text-sm font-medium mt-2">{result.time}</p>
              
              {/* Decorative elements */}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.7 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Floating Cards Component
const EnhancedFloatingCards = () => {
  const winners = [
    { name: "राजेश कुमार", amount: "₹75,000", game: "कल्याण मटका", avatar: "🎯" },
    { name: "प्रिया शर्मा", amount: "₹45,000", game: "मिलन डे", avatar: "👑" },
    { name: "अमित पटेल", amount: "₹95,000", game: "राजधानी नाइट", avatar: "💎" },
  ];

  const topGames = [
    { name: "कल्याण मटका", players: "3,250", payout: "9.8x", status: "🔥", color: "from-red-500 to-orange-500" },
    { name: "मिलन डे", players: "2,890", payout: "8.5x", status: "⚡", color: "from-blue-500 to-purple-500" },
    { name: "टाइम बाजार", players: "2,154", payout: "7.9x", status: "🎯", color: "from-green-500 to-emerald-500" },
  ];

  const tips = [
    "छोटी राशि से शुरू करें और धीरे-धीरे बढ़ाएं",
    "पैटर्न और ट्रेंड्स का अध्ययन करें",
    "जिम्मेदार गेमिंग के लिए बजट निर्धारित करें",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
      {/* Latest Winners */}
      <motion.div
        className="floating-card group"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
        viewport={{ once: true }}
      >
        <Card className="glass-card border-yellow-500/50 h-full bg-gradient-to-br from-yellow-900/20 to-orange-900/20 hover:border-yellow-400/80 transition-all duration-500 group-hover:scale-105">
          <CardContent className="p-6">
            <motion.h3 
              className="text-yellow-400 font-bold text-xl mb-6 flex items-center gap-3"
              animate={{ 
                textShadow: [
                  '0 0 5px rgba(251, 191, 36, 0.5)',
                  '0 0 20px rgba(251, 191, 36, 0.8)',
                  '0 0 5px rgba(251, 191, 36, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-6 h-6" />
              Latest Winners 🏆
            </motion.h3>
            <div className="space-y-4">
              {winners.map((winner, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-4 border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-300"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                  whileHover={{ scale: 1.03, x: 10 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl shadow-lg"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      {winner.avatar}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-white font-bold">{winner.name}</p>
                      <p className="text-gray-400 text-sm">{winner.game}</p>
                    </div>
                    <motion.p
                      className="text-yellow-400 font-bold text-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {winner.amount}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Games */}
      <motion.div
        className="floating-card group"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
        viewport={{ once: true }}
      >
        <Card className="glass-card border-purple-500/50 h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 hover:border-purple-400/80 transition-all duration-500 group-hover:scale-105">
          <CardContent className="p-6">
            <motion.h3 
              className="text-purple-400 font-bold text-xl mb-6 flex items-center gap-3"
              animate={{ 
                textShadow: [
                  '0 0 5px rgba(147, 51, 234, 0.5)',
                  '0 0 20px rgba(147, 51, 234, 0.8)',
                  '0 0 5px rgba(147, 51, 234, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-6 h-6" />
              Top Games 🌟
            </motion.h3>
            <div className="space-y-4">
              {topGames.map((game, index) => (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-r ${game.color}/20 rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 relative overflow-hidden`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 + 0.7 }}
                  whileHover={{ scale: 1.03, x: -10 }}
                >
                  <motion.div
                    className="absolute top-0 right-0 text-2xl"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {game.status}
                  </motion.div>
                  <p className="text-white font-bold text-lg pr-8">{game.name}</p>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-400">{game.players} players</span>
                    <motion.span
                      className="text-purple-400 font-bold text-lg"
                      animate={{ 
                        color: [
                          'rgb(147, 51, 234)',
                          'rgb(34, 197, 94)',
                          'rgb(147, 51, 234)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {game.payout}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Matka Tips */}
      <motion.div
        className="floating-card group"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
        viewport={{ once: true }}
      >
        <Card className="glass-card border-green-500/50 h-full bg-gradient-to-br from-green-900/20 to-emerald-900/20 hover:border-green-400/80 transition-all duration-500 group-hover:scale-105">
          <CardContent className="p-6">
            <motion.h3 
              className="text-green-400 font-bold text-xl mb-6 flex items-center gap-3"
              animate={{ 
                textShadow: [
                  '0 0 5px rgba(34, 197, 94, 0.5)',
                  '0 0 20px rgba(34, 197, 94, 0.8)',
                  '0 0 5px rgba(34, 197, 94, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-6 h-6" />
              Pro Tips 💡
            </motion.h3>
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/30 hover:border-green-400/60 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.9 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0 mt-1"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      {index + 1}
                    </motion.div>
                    <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const UltraModernLandingPage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 150]);
  const y2 = useTransform(scrollY, [0, 300], [0, -150]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.3]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 overflow-hidden">
      {/* Enhanced Indian Mascot */}
      <EnhancedIndianMascot />

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ opacity }}
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-yellow-400/15 to-orange-500/15 rounded-full blur-3xl"
          style={{ y: y1 }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl"
          style={{ y: y2 }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0] 
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"
          animate={{ 
            x: [0, 100, -100, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.3, 0.8, 1]
          }}
          transition={{ duration: 30, repeat: Infinity }}
        />

        <div className="container mx-auto text-center relative z-10 px-4">
          <motion.div
            className="mb-12"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2, type: "spring" }}
          >
            <UltraWheelSpinner />
          </motion.div>

          <motion.h1
            className="text-7xl md:text-9xl font-black mb-8 hindi-font relative"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2, type: "spring" }}
          >
            <motion.span
              className="bg-gradient-to-r from-yellow-400 via-red-500 via-pink-500 to-purple-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                backgroundSize: '200% 200%',
                textShadow: '0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,20,147,0.6)',
                filter: 'drop-shadow(0 0 15px rgba(255,215,0,1))'
              }}
            >
              MATKA 100
            </motion.span>
            
            {/* Floating text effects */}
            <motion.div
              className="absolute -top-6 -right-6 text-2xl"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              👑
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 text-3xl"
              animate={{ 
                rotate: [360, 0],
                scale: [1.2, 1, 1.2]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              💎
            </motion.div>
          </motion.h1>

          <motion.p
            className="text-3xl md:text-4xl text-white mb-6 font-bold"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            style={{
              textShadow: '0 0 30px rgba(255,255,255,0.8)'
            }}
          >
            <motion.span
              animate={{ 
                color: [
                  'rgb(255, 255, 255)',
                  'rgb(34, 197, 94)',
                  'rgb(59, 130, 246)',
                  'rgb(255, 255, 255)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              भारत का #1 मटका गेमिंग प्लेटफॉर्म
            </motion.span>
          </motion.p>

          <motion.p
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            आधुनिक तकनीक के साथ पारंपरिक मटका का रोमांच अनुभव करें।
            जिम्मेदारी से खेलें, बड़ा जीतें, और हजारों विजेताओं में शामिल हों!
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/games')}
                className="group relative px-12 py-6 text-xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 hover:from-yellow-500 hover:via-orange-600 hover:to-red-700 text-black rounded-full shadow-2xl transition-all duration-500"
                style={{
                  boxShadow: '0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,140,0,0.6)'
                }}
              >
                <motion.span
                  className="flex items-center gap-3"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play className="w-8 h-8" />
                  अभी खेलें
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </motion.span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/results')}
                variant="outline"
                className="px-12 py-6 text-xl font-black border-4 border-purple-500 text-purple-400 hover:bg-purple-500/20 rounded-full transition-all duration-500 hover:scale-105"
                style={{
                  boxShadow: '0 0 30px rgba(147,51,234,0.6)'
                }}
              >
                <Trophy className="w-8 h-8 mr-3" />
                परिणाम देखें
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/wallet')}
                variant="outline"
                className="px-12 py-6 text-xl font-black border-4 border-green-500 text-green-400 hover:bg-green-500/20 rounded-full transition-all duration-500 hover:scale-105"
                style={{
                  boxShadow: '0 0 30px rgba(34,197,94,0.6)'
                }}
              >
                <Zap className="w-8 h-8 mr-3" />
                वॉलेट रिचार्ज
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Live Stats Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <EnhancedLivePayoutTicker />
            <EnhancedRealTimeResults />
          </div>
        </div>
      </motion.section>

      {/* Enhanced Floating Cards Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-black mb-6 hindi-font"
              animate={{
                backgroundImage: [
                  'linear-gradient(45deg, #8B5CF6, #EC4899)',
                  'linear-gradient(45deg, #EC4899, #F59E0B)',
                  'linear-gradient(45deg, #F59E0B, #8B5CF6)',
                ],
              }}
              transition={{ duration: 6, repeat: Infinity }}
              style={{
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 40px rgba(139,92,246,0.8)'
              }}
            >
              विजेताओं के सर्कल में शामिल हों
            </motion.h2>
            <p className="text-gray-300 text-xl">जानें कि MATKA 100 को क्या खास बनाता है</p>
          </motion.div>
          <EnhancedFloatingCards />
        </div>
      </motion.section>

      {/* Enhanced Footer */}
      <motion.footer
        className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-20 px-4 border-t border-gray-800 relative overflow-hidden"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundImage: [
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="container mx-auto max-w-7xl relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <motion.h3 
                className="text-3xl font-black text-white hindi-font"
                animate={{ 
                  textShadow: [
                    '0 0 10px rgba(255,255,255,0.5)',
                    '0 0 20px rgba(255,255,255,0.8)',
                    '0 0 10px rgba(255,255,255,0.5)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                MATKA 100
              </motion.h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                भारत का सबसे भरोसेमंद मटका गेमिंग प्लेटफॉर्म। 
                सुरक्षित भुगतान और निष्पक्ष खेल के साथ।
              </p>
              <div className="flex space-x-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:text-white hover:border-white transition-all duration-300">
                    <Download className="w-5 h-5 mr-2" />
                    Android
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:text-white hover:border-white transition-all duration-300">
                    <Download className="w-5 h-5 mr-2" />
                    iOS
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-xl mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {[
                  { name: 'गेम्स', href: '/games' },
                  { name: 'परिणाम', href: '/results' },
                  { name: 'वॉलेट', href: '/wallet' },
                  { name: 'प्रोफाइल', href: '/profile' }
                ].map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 10, color: '#ffffff' }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors text-lg">
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-bold text-xl mb-6">Support</h4>
              <ul className="space-y-4">
                {[
                  'Help Center',
                  'Terms & Conditions',
                  'Privacy Policy',
                  'Responsible Gaming'
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 10, color: '#ffffff' }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-lg">
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-xl mb-6">संपर्क करें</h4>
              <div className="space-y-6">
                <motion.div 
                  className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-lg">+91 98765 43210</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-lg">support@matka100.com</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">Mumbai, India</span>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div 
            className="border-t border-gray-800 mt-16 pt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-gray-400 text-lg">
              © 2024 MATKA 100. सभी अधिकार सुरक्षित। | जिम्मेदारी से खेलें। जुआ की लत हो सकती है।
            </p>
            <motion.p 
              className="text-gray-500 text-sm mt-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              यह प्लेटफॉर्म केवल मनोरंजन के उद्देश्यों से है। कृपया जिम्मेदारी से जुआ खेलें।
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>

      {/* Custom Styles */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .floating-card {
          animation: float 8s ease-in-out infinite;
        }
        .floating-card:nth-child(2) {
          animation-delay: -2.5s;
        }
        .floating-card:nth-child(3) {
          animation-delay: -5s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(1deg); }
          50% { transform: translateY(-8px) rotate(0deg); }
          75% { transform: translateY(-12px) rotate(-1deg); }
        }
        .hindi-font {
          font-family: 'Inter', 'Devanagari Sangam MN', 'Noto Sans Devanagari', sans-serif;
          font-weight: 900;
        }
        
        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8B5CF6, #EC4899);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7C3AED, #DB2777);
        }
      `}</style>
    </div>
  );
};

export default UltraModernLandingPage;

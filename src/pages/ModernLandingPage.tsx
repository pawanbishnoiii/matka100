
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Zap, Trophy, Star, TrendingUp, Download, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

// Animated Indian Female Mascot Component
const IndianMascot = () => (
  <motion.div
    className="fixed top-20 right-8 z-50 hidden lg:block"
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1, duration: 0.8 }}
  >
    <motion.div
      className="relative"
      animate={{ 
        y: [0, -10, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="w-24 h-32 relative">
        {/* Mascot Figure */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-400 to-red-500 rounded-full opacity-90"></div>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full"></div>
        {/* Saree Pattern */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gradient-to-b from-pink-500 to-purple-600 rounded-b-full opacity-80"></div>
        {/* Glowing Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-xl"></div>
      </div>
      
      {/* Speech Bubble */}
      <motion.div
        className="absolute -left-48 top-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <p className="text-sm font-semibold">Win Big Today! 🎰</p>
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-purple-600 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
      </motion.div>
    </motion.div>
  </motion.div>
);

// Animated Wheel Spinner Component
const WheelSpinner = () => (
  <motion.div
    className="relative w-32 h-32 mx-auto"
    animate={{ rotate: 360 }}
    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
  >
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-1">
      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
        <div className="text-2xl font-bold text-white">🎰</div>
      </div>
    </div>
    {/* Glow Effect */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-pink-500/20 blur-xl"></div>
  </motion.div>
);

// Live Payout Ticker Component
const LivePayoutTicker = () => {
  const [payouts] = useState([
    { user: "Raj***", amount: "₹15,000", game: "Kalyan" },
    { user: "Pri***", amount: "₹8,500", game: "Milan" },
    { user: "Arn***", amount: "₹22,000", game: "Rajdhani" },
    { user: "Shr***", amount: "₹5,200", game: "Time Bazar" },
  ]);

  return (
    <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-lg p-4 overflow-hidden">
      <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Live Payouts 🔥
      </h3>
      <motion.div
        className="space-y-2"
        animate={{ y: [-100, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
      >
        {payouts.map((payout, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between bg-black/30 rounded p-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div>
              <p className="text-white font-semibold">{payout.user}</p>
              <p className="text-gray-400 text-xs">{payout.game}</p>
            </div>
            <div className="text-green-400 font-bold">{payout.amount}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Real-time Results Bar Component
const RealTimeResultsBar = () => {
  const [results] = useState([
    { game: "Kalyan", result: "245", time: "3:45 PM" },
    { game: "Milan", result: "678", time: "4:45 PM" },
    { game: "Rajdhani", result: "134", time: "5:45 PM" },
  ]);

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-lg p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        Latest Results
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {results.map((result, index) => (
          <motion.div
            key={index}
            className="bg-black/30 rounded p-3 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-white font-bold text-lg">{result.result}</p>
            <p className="text-gray-400 text-sm">{result.game}</p>
            <p className="text-blue-400 text-xs">{result.time}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Floating Cards Component
const FloatingCards = () => {
  const winners = [
    { name: "Rajesh K.", amount: "₹50,000", game: "Kalyan Matka" },
    { name: "Priya S.", amount: "₹25,000", game: "Milan Day" },
    { name: "Amit P.", amount: "₹75,000", game: "Rajdhani Night" },
  ];

  const topGames = [
    { name: "Kalyan Matka", players: "2,450", payout: "9.5x" },
    { name: "Milan Day", players: "1,890", payout: "8.2x" },
    { name: "Time Bazar", players: "1,654", payout: "7.8x" },
  ];

  const tips = [
    "Start with small amounts and gradually increase your bets",
    "Study the pattern and trends before placing bets",
    "Set a budget and stick to it for responsible gaming",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
      {/* Latest Winners */}
      <motion.div
        className="floating-card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
      >
        <Card className="glass-card border-yellow-500/30 h-full">
          <CardContent className="p-6">
            <h3 className="text-yellow-400 font-bold text-lg mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Latest Winners
            </h3>
            <div className="space-y-3">
              {winners.map((winner, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg p-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-white font-semibold">{winner.name}</p>
                  <p className="text-yellow-400 font-bold">{winner.amount}</p>
                  <p className="text-gray-400 text-sm">{winner.game}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Games */}
      <motion.div
        className="floating-card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Card className="glass-card border-purple-500/30 h-full">
          <CardContent className="p-6">
            <h3 className="text-purple-400 font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Top Games
            </h3>
            <div className="space-y-3">
              {topGames.map((game, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-white font-semibold">{game.name}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{game.players} players</span>
                    <span className="text-purple-400 font-bold">{game.payout}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Matka Tips */}
      <motion.div
        className="floating-card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Card className="glass-card border-green-500/30 h-full">
          <CardContent className="p-6">
            <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Pro Tips
            </h3>
            <div className="space-y-3">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg p-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-gray-300 text-sm">{tip}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const ModernLandingPage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
      {/* Indian Mascot */}
      <IndianMascot />

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"
          style={{ y: y1 }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          style={{ y: y2 }}
        />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <WheelSpinner />
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent hindi-font"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              textShadow: '0 0 30px rgba(255,215,0,0.5), 0 0 60px rgba(255,20,147,0.3)',
              filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.8))'
            }}
          >
            MATKA PRO
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl text-white mb-8 font-semibold"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{
              textShadow: '0 0 20px rgba(255,255,255,0.5)'
            }}
          >
            India's #1 Matka Gaming Platform
          </motion.p>

          <motion.p
            className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Experience the thrill of traditional Matka with modern technology. 
            Play responsibly, win big, and join thousands of winners!
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <Button
              onClick={() => navigate('/games')}
              className="group relative px-8 py-4 text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              style={{
                boxShadow: '0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,140,0,0.4)'
              }}
            >
              <Play className="w-6 h-6 mr-2" />
              Play Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              onClick={() => navigate('/results')}
              variant="outline"
              className="px-8 py-4 text-lg font-bold border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 rounded-full transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 0 20px rgba(147,51,234,0.4)'
              }}
            >
              <Trophy className="w-6 h-6 mr-2" />
              View Results
            </Button>

            <Button
              onClick={() => navigate('/wallet')}
              variant="outline"
              className="px-8 py-4 text-lg font-bold border-2 border-green-500 text-green-400 hover:bg-green-500/10 rounded-full transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 0 20px rgba(34,197,94,0.4)'
              }}
            >
              <Zap className="w-6 h-6 mr-2" />
              Recharge Wallet
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Live Stats Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LivePayoutTicker />
            <RealTimeResultsBar />
          </div>
        </div>
      </motion.section>

      {/* Floating Cards Section */}
      <motion.section
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hindi-font">
              Join the Winners Circle
            </h2>
            <p className="text-gray-300 text-lg">Discover what makes Matka Pro special</p>
          </motion.div>
          <FloatingCards />
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-gradient-to-r from-gray-900 to-black py-16 px-4 border-t border-gray-800"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 hindi-font">Matka Pro</h3>
              <p className="text-gray-400 mb-4">
                India's most trusted Matka gaming platform with secure payments and fair play.
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Android
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-400 hover:text-white">
                  <Download className="w-4 h-4 mr-2" />
                  iOS
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/games" className="text-gray-400 hover:text-white transition-colors">Games</a></li>
                <li><a href="/results" className="text-gray-400 hover:text-white transition-colors">Results</a></li>
                <li><a href="/wallet" className="text-gray-400 hover:text-white transition-colors">Wallet</a></li>
                <li><a href="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/responsible-gaming" className="text-gray-400 hover:text-white transition-colors">Responsible Gaming</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>support@matkapro.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Matka Pro. All rights reserved. | Play responsibly. Gambling can be addictive.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              This platform is for entertainment purposes only. Please gamble responsibly.
            </p>
          </div>
        </div>
      </motion.footer>

      {/* Custom Styles */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .floating-card {
          animation: float 6s ease-in-out infinite;
        }
        .floating-card:nth-child(2) {
          animation-delay: -2s;
        }
        .floating-card:nth-child(3) {
          animation-delay: -4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .hindi-font {
          font-family: 'Inter', 'Devanagari Sangam MN', 'Noto Sans Devanagari', sans-serif;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default ModernLandingPage;

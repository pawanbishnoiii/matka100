import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Code, LayoutDashboard, Users, ShieldCheck, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/layout/BottomNavigation';

const Index = () => {
  const features = [
    {
      title: 'Ultra-Modern Design',
      description: 'Sleek, intuitive interface for a premium gaming experience.',
      icon: Sparkles,
    },
    {
      title: 'Real-Time Gameplay',
      description: 'Experience live game updates and results.',
      icon: Rocket,
    },
    {
      title: 'Secure & Reliable',
      description: 'Advanced security measures to protect your data and transactions.',
      icon: ShieldCheck,
    },
    {
      title: 'Admin Panel',
      description: 'Manage games, payouts, and users with ease.',
      icon: LayoutDashboard,
    },
    {
      title: 'User Management',
      description: 'Robust user management tools for admins.',
      icon: Users,
    },
    {
      title: 'Clean Codebase',
      description: 'Well-structured and maintainable code.',
      icon: Code,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <motion.div
          className="container mx-auto text-center py-20 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 animate-float"
            variants={itemVariants}
          >
            MATKA 100
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-8"
            variants={itemVariants}
          >
            Experience the future of online gaming.
          </motion.p>
          <motion.div className="flex justify-center space-x-4" variants={itemVariants}>
            <Button asChild variant="primary" size="lg">
              <Link to="/games">Play Now</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/auth">Get Started</Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 glass-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700"
                variants={itemVariants}
              >
                <feature.icon className="w-6 h-6 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <BottomNavigation />
    </>
  );
};

export default Index;

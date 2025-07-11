
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Gamepad2, Wallet, BarChart3, User, Menu, X } from "lucide-react";
import Index from "./pages/Index";
import GameScreen from "./pages/GameScreen";
import WalletPage from "./pages/WalletPage";
import ResultsPage from "./pages/ResultsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

const App = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Games', href: '/games', icon: Gamepad2 },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
    { name: 'Results', href: '/results', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/games" element={<GameScreen />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Mobile Bottom Navigation */}
            <motion.nav 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="fixed bottom-0 left-0 right-0 md:hidden glass-card border-t border-gray-700/50 p-4"
            >
              <div className="flex justify-around items-center">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-700/50 transition-all"
                  >
                    <item.icon className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-400">{item.name}</span>
                  </a>
                ))}
              </div>
            </motion.nav>

            {/* Desktop Sidebar Navigation */}
            <motion.nav 
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              className="hidden md:fixed md:left-0 md:top-0 md:h-full md:w-64 glass-card border-r border-gray-700/50 p-6 z-10"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent hindi-font">
                  Matka100
                </h2>
                <p className="text-sm text-gray-400">Gaming Platform</p>
              </div>
              
              <div className="space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-all text-gray-300 hover:text-white"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            </motion.nav>

            {/* Desktop Content Offset */}
            <div className="hidden md:block md:ml-64">
              {/* Content goes here - handled by Routes */}
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;


import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import ModernIndex from './pages/ModernIndex';
import AuthPage from './pages/AuthPage';
import GamesListPage from './pages/GamesListPage';
import GameScreen from './pages/GameScreen';
import MobileGamePage from './pages/MobileGamePage';
import ResultsPage from './pages/ResultsPage';
import WalletPage from './pages/WalletPage';
import ProfileScreen from './components/ProfileScreen';
import EnhancedProfilePage from './pages/EnhancedProfilePage';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import HelpPage from '@/pages/HelpPage';
import ModernAppLayout from './components/layout/ModernAppLayout';

// Import our modern styles
import './styles/theme.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Routes with Modern Layout */}
          <Route path="/" element={<ModernAppLayout />}>
            <Route index element={<ModernIndex />} />
            <Route path="games" element={<GamesListPage />} />
            <Route path="game/:gameId" element={<GameScreen />} />
            <Route path="mobile-game/:gameId" element={<MobileGamePage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="profile" element={<EnhancedProfilePage />} />
            <Route path="profile-overview" element={<ProfileScreen />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
          
          {/* Standalone routes (no layout) */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

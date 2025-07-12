import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from './integrations/supabase/client';
import Index from './pages/Index';
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/games" element={<GamesListPage />} />
          <Route path="/game/:gameId" element={<GameScreen />} />
          <Route path="/mobile-game/:gameId" element={<MobileGamePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/profile" element={<EnhancedProfilePage />} />
          <Route path="/profile-overview" element={<ProfileScreen />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

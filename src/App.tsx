
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
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
import LeaderboardPage from './pages/LeaderboardPage';
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
          {/* Public route - Landing page for non-authenticated users */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/games">
                <ModernIndex />
              </ProtectedRoute>
            } 
          />
          
          {/* Auth route - Only accessible to non-authenticated users */}
          <Route 
            path="/auth" 
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/games">
                <AuthPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes - Only accessible to authenticated users */}
          <Route 
            path="/games" 
            element={
              <ProtectedRoute>
                <ModernAppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<GamesListPage />} />
          </Route>
          
          <Route 
            path="/game/:gameId" 
            element={
              <ProtectedRoute>
                <ModernAppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<GameScreen />} />
          </Route>
          
          <Route 
            path="/mobile-game/:gameId" 
            element={
              <ProtectedRoute>
                <ModernAppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MobileGamePage />} />
          </Route>
          
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <ModernAppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ResultsPage />} />
          </Route>
          
          <Route 
            path="/wallet" 
            element={
              <ProtectedRoute>
                <ModernAppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<WalletPage />} />
          </Route>
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ModernAppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<EnhancedProfilePage />} />
          </Route>
          
          <Route 
            path="/profile-overview" 
            element={
              <ProtectedRoute>
                <ModernAppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileScreen />} />
          </Route>
          
          <Route 
            path="/help" 
            element={
              <ProtectedRoute>
                <ModernAppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HelpPage />} />
          </Route>
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <ModernAppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminPage />} />
          </Route>
          
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <ModernAppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<LeaderboardPage />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

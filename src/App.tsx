import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import UltraModernLandingPage from "./pages/UltraModernLandingPage";
import GameScreen from "./pages/GameScreen";
import GamesListPage from "./pages/GamesListPage";
import ResultsPage from "./pages/ResultsPage";
import WalletPage from "./pages/WalletPage";
import EnhancedProfilePage from "./pages/EnhancedProfilePage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<UltraModernLandingPage />} />
              <Route path="/classic" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/games" element={<GamesListPage />} />
              <Route path="/game/:gameId" element={<GameScreen />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/profile" element={<EnhancedProfilePage />} />
              <Route path="/profile/edit" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

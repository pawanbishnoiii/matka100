
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import UltraModernLandingPage from "./pages/UltraModernLandingPage";
import MobileGamePage from "./pages/MobileGamePage";
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
              {/* Auth routes (no layout) */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
              
              {/* App routes with layout */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<UltraModernLandingPage />} />
                <Route path="/classic" element={<Index />} />
                <Route path="/games" element={<MobileGamePage />} />
                <Route path="/games-list" element={<GamesListPage />} />
                <Route path="/game/:gameId" element={<MobileGamePage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/profile" element={<EnhancedProfilePage />} />
                <Route path="/profile/edit" element={<ProfilePage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

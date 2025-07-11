
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, X, Chrome, Facebook, Shield, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput } from '@/components/ui/premium-input';
import { PremiumCard } from '@/components/ui/premium-card';

interface ModernAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModernAuthModal = ({ isOpen, onClose }: ModernAuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onClose();
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setIsAdminLogin(true);
    setEmail('bnoy.studios@gmail.com');
    setIsLogin(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-md"
        >
          <PremiumCard className="relative overflow-hidden">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {isAdminLogin ? 'Admin Access' : isLogin ? 'Welcome Back!' : 'Join Matka Premium'}
              </h2>
              <p className="text-gray-400">
                {isAdminLogin ? 'Restricted admin access only' : isLogin ? 'Sign in to continue playing' : 'Create account to start your journey'}
              </p>
            </div>

            {/* Admin Login Toggle */}
            {!isAdminLogin && (
              <div className="text-center mb-6">
                <button
                  onClick={handleAdminLogin}
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center mx-auto gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin Login
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && !isAdminLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <PremiumInput
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    icon={<User className="w-5 h-5" />}
                    required
                  />
                </motion.div>
              )}
              
              <PremiumInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                icon={<Mail className="w-5 h-5" />}
                disabled={isAdminLogin}
                required
              />
              
              <div className="relative">
                <PremiumInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  icon={<Lock className="w-5 h-5" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {isAdminLogin && (
                <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-xl p-4">
                  <p className="text-yellow-400 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin access restricted to authorized personnel only
                  </p>
                </div>
              )}

              <PremiumButton
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                {isAdminLogin ? 'Access Admin Panel' : isLogin ? 'Sign In' : 'Create Account'}
              </PremiumButton>
            </form>

            {!isAdminLogin && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-900 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <PremiumButton
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="flex items-center justify-center gap-2"
                  >
                    <Chrome className="w-5 h-5 text-red-400" />
                    Google
                  </PremiumButton>
                  <PremiumButton
                    variant="outline"
                    disabled={loading}
                    className="flex items-center justify-center gap-2"
                  >
                    <Facebook className="w-5 h-5 text-blue-400" />
                    Facebook
                  </PremiumButton>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setIsAdminLogin(false);
                      setEmail('');
                      setPassword('');
                      setName('');
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Sign in'}
                  </button>
                </div>
              </>
            )}

            {isAdminLogin && (
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminLogin(false);
                    setEmail('');
                    setPassword('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to User Login
                </button>
              </div>
            )}
          </PremiumCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, X, Chrome, Facebook, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleFacebookSignIn = async () => {
    // Facebook auth implementation would go here
    console.log('Facebook sign in - to be implemented');
  };

  const handleAdminLogin = () => {
    setIsAdminLogin(true);
    setEmail('bnoy.studios@gmail.com');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card-premium border-gray-700/50 overflow-hidden">
          <CardHeader className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full gradient-matka flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white text-center font-satoshi">
                {isAdminLogin ? 'Admin Login' : isLogin ? 'Welcome Back!' : 'Join Matka100'}
              </CardTitle>
              <p className="text-gray-400 mt-2">
                {isAdminLogin ? 'Admin access only' : isLogin ? 'Sign in to your account' : 'Create your account to start playing'}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Admin Login Toggle */}
            {!isAdminLogin && (
              <div className="text-center">
                <Button
                  onClick={handleAdminLogin}
                  variant="ghost"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Login
                </Button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isAdminLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="relative"
                >
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                    required
                  />
                </motion.div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                  required
                  disabled={isAdminLogin}
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {isAdminLogin && (
                <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-3">
                  <p className="text-yellow-400 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin access restricted to authorized email only
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full gradient-matka hover:scale-105 transition-transform text-white font-semibold py-3"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    {isAdminLogin ? 'Admin Login' : isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </Button>
            </form>

            {!isAdminLogin && (
              <>
                <div className="relative">
                  <Separator className="bg-gray-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-4 bg-gray-900 text-gray-400 text-sm">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="glass-card border-gray-600 hover:bg-gray-700/50 text-white"
                    disabled={loading}
                  >
                    <Chrome className="w-5 h-5 mr-2 text-red-400" />
                    Google
                  </Button>
                  <Button
                    onClick={handleFacebookSignIn}
                    variant="outline"
                    className="glass-card border-gray-600 hover:bg-gray-700/50 text-white"
                    disabled={loading}
                  >
                    <Facebook className="w-5 h-5 mr-2 text-blue-400" />
                    Facebook
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    variant="link"
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
                  </Button>
                </div>
              </>
            )}

            {isAdminLogin && (
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => {
                    setIsAdminLogin(false);
                    setEmail('');
                    setPassword('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to User Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthModal;

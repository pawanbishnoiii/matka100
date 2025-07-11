
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Phone, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const AuthSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      await signInWithEmail(loginForm.email, loginForm.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (signupForm.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    try {
      await signUpWithEmail(signupForm.email, signupForm.password);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-black/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold heading-premium mb-6">
            Join the Elite
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Create your account and get 
            <span className="text-gradient font-semibold"> ₹100 welcome bonus</span> + 
            <span className="text-accent-gradient font-semibold"> exclusive rewards</span>
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="premium-card neon-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gradient">
                  Start Your Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-black/20">
                    <TabsTrigger value="login" className="data-[state=active]:bg-blue-600">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-purple-600">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4 mt-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                            className="pl-10 bg-black/20 border-white/20 text-white"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                            className="pl-10 pr-10 bg-black/20 border-white/20 text-white"
                            placeholder="Enter your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full btn-premium"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4 mt-6">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            type="text"
                            value={signupForm.name}
                            onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                            className="pl-10 bg-black/20 border-white/20 text-white"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            type="email"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                            className="pl-10 bg-black/20 border-white/20 text-white"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Phone (Optional)</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            type="tel"
                            value={signupForm.phone}
                            onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                            className="pl-10 bg-black/20 border-white/20 text-white"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={signupForm.password}
                            onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                            className="pl-10 pr-10 bg-black/20 border-white/20 text-white"
                            placeholder="Create a password"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            type="password"
                            value={signupForm.confirmPassword}
                            onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                            className="pl-10 bg-black/20 border-white/20 text-white"
                            placeholder="Confirm your password"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full btn-premium"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>

                    {/* Welcome Bonus Info */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-lg border border-green-400/20">
                      <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                        <Gift className="w-4 h-4" />
                        Welcome Bonus: ₹100 + 50 Free Spins
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-white/60">or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </div>

                {/* Terms */}
                <p className="text-xs text-white/60 text-center mt-4 leading-relaxed">
                  By continuing, you agree to our Terms of Service and Privacy Policy. 
                  Must be 18+ to play. Play responsibly.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

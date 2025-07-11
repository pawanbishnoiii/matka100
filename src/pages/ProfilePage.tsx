
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Shield, 
  Gift,
  Settings,
  LogOut,
  Upload,
  Copy,
  Check,
  HelpCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import HelpSection from '../components/HelpSection';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'help'>('profile');
  
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    uui_id: '',
    kyc_status: 'pending',
    referral_code: '',
    balance_inr: 0,
    balance_gbp: 0
  });

  const [kycSettings, setKycSettings] = useState({ enabled: true });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchKycSettings();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfileData({
        name: data.name || '',
        phone: data.phone || '',
        uui_id: data.uui_id || '',
        kyc_status: data.kyc_status || 'pending',
        referral_code: data.referral_code || '',
        balance_inr: data.balance_inr || 0,
        balance_gbp: data.balance_gbp || 0
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchKycSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'kyc_enabled')
        .single();

      if (error) throw error;
      setKycSettings({ enabled: data.value || false });
    } catch (error) {
      console.error('Error fetching KYC settings:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-8"></div>
            <div className="h-48 bg-gray-700 rounded mb-8"></div>
            <div className="h-96 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card border-b border-gray-700/50 p-4 mb-6"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white hindi-font">Profile</h1>
              <p className="text-sm text-gray-400">Manage your account</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab(activeTab === 'profile' ? 'help' : 'profile')}
              className="neon-blue-glow bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {activeTab === 'profile' ? <HelpCircle className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
              {activeTab === 'profile' ? 'Help' : 'Profile'}
            </Button>
            {activeTab === 'profile' && (
              <Button
                onClick={isEditing ? handleSave : () => setIsEditing(!isEditing)}
                disabled={saving}
                className="neon-blue-glow bg-gradient-to-r from-blue-600 to-cyan-600"
              >
                <Settings className="w-4 h-4 mr-2" />
                {isEditing ? (saving ? 'Saving...' : 'Save') : 'Edit'}
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 max-w-4xl">
        {activeTab === 'profile' ? (
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-card border-gray-700 neon-blue-glow">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                      {isEditing ? (
                        <div className="space-y-4">
                          <Input
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="bg-gray-800/50 border-gray-600 text-white text-lg"
                            placeholder="Full Name"
                          />
                          <Input
                            value={user.email}
                            className="bg-gray-800/50 border-gray-600 text-white"
                            disabled
                          />
                          <Input
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="bg-gray-800/50 border-gray-600 text-white"
                            placeholder="Phone Number"
                            type="tel"
                          />
                        </div>
                      ) : (
                        <>
                          <h2 className="text-3xl font-bold text-white mb-2 hindi-font">
                            {profileData.name || user.email?.split('@')[0]}
                          </h2>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-300 justify-center md:justify-start">
                              <Mail className="w-4 h-4" />
                              <span>{user.email}</span>
                            </div>
                            {profileData.phone && (
                              <div className="flex items-center gap-2 text-gray-300 justify-center md:justify-start">
                                <Phone className="w-4 h-4" />
                                <span>{profileData.phone}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* KYC Status */}
                    {kycSettings.enabled && (
                      <div className="text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          profileData.kyc_status === 'approved' 
                            ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                            : profileData.kyc_status === 'pending'
                            ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                            : 'bg-red-600/20 text-red-400 border border-red-600/30'
                        }`}>
                          <Shield className="w-4 h-4" />
                          KYC {profileData.kyc_status.charAt(0).toUpperCase() + profileData.kyc_status.slice(1)}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* UUI ID Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card border-gray-700 neon-green-glow">
                <CardHeader>
                  <CardTitle className="text-white hindi-font">Your UUI ID</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-3 bg-gray-800 rounded font-mono text-lg text-white">
                      {profileData.uui_id || 'Loading...'}
                    </div>
                    <Button
                      onClick={() => copyToClipboard(profileData.uui_id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Share this UUI ID to receive P2P transfers from other users
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Referral Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card border-gray-700 neon-green-glow">
                <CardHeader>
                  <CardTitle className="text-white hindi-font flex items-center gap-2">
                    <Gift className="w-6 h-6 text-yellow-400" />
                    Referral Program
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-4 glass-card rounded-lg">
                      <p className="text-2xl font-bold text-white mb-1">{profileData.referral_code}</p>
                      <p className="text-gray-400 text-sm">Your Referral Code</p>
                      <Button
                        onClick={() => copyToClipboard(profileData.referral_code)}
                        size="sm"
                        className="mt-2 bg-yellow-600 hover:bg-yellow-700"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    
                    <div className="text-center p-4 glass-card rounded-lg">
                      <p className="text-2xl font-bold text-green-400 mb-1">₹{profileData.balance_inr}</p>
                      <p className="text-gray-400 text-sm">Current Balance</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
                    <p className="text-white text-center hindi-font">
                      Share your referral code and earn ₹100 for each friend who joins!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="grid grid-cols-1 gap-4">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="glass-card border-red-600/50 hover:bg-red-600/10 p-6 h-auto flex items-center gap-3 text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-6 h-6" />
                  <div className="text-left">
                    <p className="font-semibold">Logout</p>
                    <p className="text-sm text-gray-400">Sign out of your account</p>
                  </div>
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          <HelpSection />
        )}
      </div>

      {/* Bottom Padding for Mobile Navigation */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default ProfilePage;


import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Shield, 
  Users, 
  Gift,
  Settings,
  LogOut,
  Upload
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const ProfilePage = () => {
  const [userProfile] = useState({
    name: 'Raj Kumar',
    email: 'raj.kumar@email.com',
    phone: '+91 9876543210',
    avatar: null,
    kycStatus: 'pending',
    referralCode: 'RAJ2024',
    totalReferrals: 15,
    referralEarnings: 2500
  });

  const [isEditing, setIsEditing] = useState(false);

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
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white hindi-font">Profile</h1>
              <p className="text-sm text-gray-400">Manage your account</p>
            </div>
          </div>
          
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="neon-blue-glow bg-gradient-to-r from-blue-600 to-cyan-600"
          >
            <Settings className="w-4 h-4 mr-2" />
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass-card border-gray-700 neon-blue-glow">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
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
                        defaultValue={userProfile.name}
                        className="bg-gray-800/50 border-gray-600 text-white text-lg"
                        placeholder="Full Name"
                      />
                      <Input
                        defaultValue={userProfile.email}
                        className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="Email"
                        type="email"
                      />
                      <Input
                        defaultValue={userProfile.phone}
                        className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="Phone Number"
                        type="tel"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold text-white mb-2 hindi-font">{userProfile.name}</h2>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-300 justify-center md:justify-start">
                          <Mail className="w-4 h-4" />
                          <span>{userProfile.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 justify-center md:justify-start">
                          <Phone className="w-4 h-4" />
                          <span>{userProfile.phone}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* KYC Status */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                    userProfile.kycStatus === 'verified' 
                      ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                      : userProfile.kycStatus === 'pending'
                      ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                      : 'bg-red-600/20 text-red-400 border border-red-600/30'
                  }`}>
                    <Shield className="w-4 h-4" />
                    KYC {userProfile.kycStatus.charAt(0).toUpperCase() + userProfile.kycStatus.slice(1)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-card border-gray-700 neon-green-glow">
            <CardHeader>
              <CardTitle className="text-white hindi-font flex items-center gap-2">
                <Gift className="w-6 h-6 text-yellow-400" />
                Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 glass-card rounded-lg">
                  <p className="text-2xl font-bold text-white mb-1">{userProfile.referralCode}</p>
                  <p className="text-gray-400 text-sm">Your Referral Code</p>
                </div>
                
                <div className="text-center p-4 glass-card rounded-lg">
                  <p className="text-2xl font-bold text-blue-400 mb-1">{userProfile.totalReferrals}</p>
                  <p className="text-gray-400 text-sm">Total Referrals</p>
                </div>
                
                <div className="text-center p-4 glass-card rounded-lg">
                  <p className="text-2xl font-bold text-green-400 mb-1">₹{userProfile.referralEarnings}</p>
                  <p className="text-gray-400 text-sm">Earnings</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
                <p className="text-white text-center hindi-font">
                  Share your referral code and earn ₹100 for each friend who joins!
                </p>
                <Button className="w-full mt-3 neon-glow bg-gradient-to-r from-blue-600 to-purple-600">
                  Share Referral Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* KYC Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white hindi-font flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-400" />
                KYC Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile.kycStatus === 'pending' ? (
                <div className="text-center py-6">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-4">Upload your documents to complete KYC verification</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="glass-card border-gray-600 hover:bg-gray-700/50">
                      Upload Aadhaar Card
                    </Button>
                    <Button variant="outline" className="glass-card border-gray-600 hover:bg-gray-700/50">
                      Upload PAN Card
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <p className="text-green-400 text-lg font-semibold">KYC Verification Complete</p>
                  <p className="text-gray-400">Your account is fully verified</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="glass-card border-gray-600 hover:bg-gray-700/50 p-6 h-auto flex items-center gap-3"
            >
              <Settings className="w-6 h-6 text-blue-400" />
              <div className="text-left">
                <p className="font-semibold text-white">Account Settings</p>
                <p className="text-sm text-gray-400">Manage your preferences</p>
              </div>
            </Button>
            
            <Button
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

      {/* Bottom Padding for Mobile Navigation */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default ProfilePage;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, FileText, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { LegalPagesViewer } from '@/components/legal/LegalPagesViewer';
import { HelpCenter } from '@/components/help/HelpCenter';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white mb-4">Please login to access your profile</p>
          <Button onClick={() => navigate('/auth')} className="bg-purple-600 hover:bg-purple-700">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 bg-black/30 backdrop-blur-sm rounded-lg p-4"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-white hindi-font">My Profile</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-6 bg-gray-800/50 border border-gray-700">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="legal" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Legal</span>
              </TabsTrigger>
              <TabsTrigger 
                value="help" 
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Help</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-0">
              <ProfileForm />
            </TabsContent>

            <TabsContent value="legal" className="mt-0">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white hindi-font mb-2">Legal Documents</h2>
                <p className="text-gray-400">Review our policies and terms</p>
              </div>
              <LegalPagesViewer />
            </TabsContent>

            <TabsContent value="help" className="mt-0">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white hindi-font mb-2">Help & Support</h2>
                <p className="text-gray-400">Get assistance and submit tickets</p>
              </div>
              <HelpCenter />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;

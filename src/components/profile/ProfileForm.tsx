
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ProfileImageUploader } from './ProfileImageUploader';

export const ProfileForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    date_of_birth: '',
    upi_id: '',
    usdt_address: '',
    profile_image_url: '',
    uui_id: '',
    referral_code: '',
    balance_inr: 0,
    balance_gbp: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setUserData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          date_of_birth: data.date_of_birth || '',
          upi_id: data.upi_id || '',
          usdt_address: data.usdt_address || '',
          profile_image_url: data.profile_image_url || '',
          uui_id: data.uui_id || '',
          referral_code: data.referral_code || '',
          balance_inr: data.balance_inr || 0,
          balance_gbp: data.balance_gbp || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch profile data',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          pincode: userData.pincode,
          date_of_birth: userData.date_of_birth || null,
          upi_id: userData.upi_id,
          usdt_address: userData.usdt_address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpdate = (imageUrl: string) => {
    setUserData(prev => ({ ...prev, profile_image_url: imageUrl }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Image Section */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font text-center">Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ProfileImageUploader
            currentImageUrl={userData.profile_image_url}
            onImageUpdate={handleImageUpdate}
          />
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white hindi-font flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Your UUI ID</Label>
            <Input
              value={userData.uui_id || 'Loading...'}
              readOnly
              className="bg-gray-800 border-gray-600 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Your Referral Code</Label>
            <Input
              value={userData.referral_code || 'Loading...'}
              readOnly
              className="bg-gray-800 border-gray-600 text-white font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">INR Balance</Label>
            <Input
              value={`₹${userData.balance_inr.toFixed(2)}`}
              readOnly
              className="bg-gray-800 border-gray-600 text-green-400 font-bold"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">GBP Balance</Label>
            <Input
              value={`£${userData.balance_gbp.toFixed(2)}`}
              readOnly
              className="bg-gray-800 border-gray-600 text-green-400 font-bold"
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <form onSubmit={handleSubmit}>
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white hindi-font flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Full Name</Label>
              <Input
                value={userData.name}
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Phone Number</Label>
              <Input
                value={userData.phone}
                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Date of Birth</Label>
              <Input
                type="date"
                value={userData.date_of_birth}
                onChange={(e) => setUserData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Email</Label>
              <Input
                value={user?.email || ''}
                readOnly
                className="bg-gray-700 border-gray-600 text-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="glass-card border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white hindi-font flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-white">Address</Label>
              <Input
                value={userData.address}
                onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter your address"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">City</Label>
              <Input
                value={userData.city}
                onChange={(e) => setUserData(prev => ({ ...prev, city: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter city"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">State</Label>
              <Input
                value={userData.state}
                onChange={(e) => setUserData(prev => ({ ...prev, state: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter state"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Pincode</Label>
              <Input
                value={userData.pincode}
                onChange={(e) => setUserData(prev => ({ ...prev, pincode: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter pincode"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card className="glass-card border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white hindi-font flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">UPI ID</Label>
              <Input
                value={userData.upi_id}
                onChange={(e) => setUserData(prev => ({ ...prev, upi_id: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="your-upi@bank"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">USDT TRC-20 Address</Label>
              <Input
                value={userData.usdt_address}
                onChange={(e) => setUserData(prev => ({ ...prev, usdt_address: e.target.value }))}
                className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                placeholder="TRC-20 wallet address"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Save Profile
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

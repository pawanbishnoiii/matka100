
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Save, X, Camera, MapPin, Calendar, Phone, Mail, CreditCard, Shield, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProfileImageUploader } from './profile/ProfileImageUploader';
import { useNavigate } from 'react-router-dom';

export const ProfileScreen = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    upi_id: '',
    usdt_address: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching profile for user:', user?.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          // User doesn't exist, create profile
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: user?.id,
              email: user?.email || '',
              name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
              balance_inr: 0,
              balance_gbp: 0,
              status: 'active',
              kyc_status: 'pending',
              is_admin: user?.email === 'bnoy.studios@gmail.com'
            });
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
          
          // Fetch newly created profile
          const { data: newData, error: newError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user?.id)
            .single();
          
          if (newError) throw newError;
          setUserData(newData);
          setFormData({
            name: newData.name || '',
            phone: newData.phone || '',
            date_of_birth: newData.date_of_birth || '',
            address: newData.address || '',
            city: newData.city || '',
            state: newData.state || '',
            pincode: newData.pincode || '',
            upi_id: newData.upi_id || '',
            usdt_address: newData.usdt_address || ''
          });
        } else {
          throw error;
        }
      } else {
        console.log('Profile data fetched:', data);
        setUserData(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          date_of_birth: data.date_of_birth || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          upi_id: data.upi_id || '',
          usdt_address: data.usdt_address || ''
        });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user || !userData) return;

    setSaving(true);
    try {
      console.log('Updating profile with data:', formData);
      
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth || null,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          upi_id: formData.upi_id,
          usdt_address: formData.usdt_address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      console.log('Profile updated successfully');
      
      // Refresh user data
      await fetchUserProfile();
      setEditing(false);
      
      toast({
        title: 'Profile Updated! 🎉',
        description: 'Your profile information has been saved successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        date_of_birth: userData.date_of_birth || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        pincode: userData.pincode || '',
        upi_id: userData.upi_id || '',
        usdt_address: userData.usdt_address || ''
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white hindi-font">My Profile</h1>
                <p className="text-gray-400">Manage your account information</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="glass-card border-gray-700">
              <CardHeader className="text-center">
                <ProfileImageUploader 
                  currentImageUrl={userData?.profile_image_url}
                  onImageUpdate={fetchUserProfile}
                />
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-white">{userData?.name || 'User'}</h3>
                  <p className="text-gray-400">{userData?.email}</p>
                  <p className="text-sm text-blue-400 mt-1">UUI: {userData?.uui_id}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Balance (INR)</span>
                  </div>
                  <span className="text-green-400 font-bold">₹{userData?.balance_inr?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">KYC Status</span>
                  </div>
                  <span className={`font-medium ${
                    userData?.kyc_status === 'approved' ? 'text-green-400' : 
                    userData?.kyc_status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {userData?.kyc_status || 'Pending'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  {!editing ? (
                    <Button
                      onClick={() => setEditing(true)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Full Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!editing}
                        className="bg-gray-800 border-gray-600 text-white disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Email</Label>
                      <Input
                        value={userData?.email || ''}
                        disabled
                        className="bg-gray-800 border-gray-600 text-white opacity-60"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Phone Number</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!editing}
                        placeholder="Enter phone number"
                        className="bg-gray-800 border-gray-600 text-white disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Date of Birth</Label>
                      <Input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        disabled={!editing}
                        className="bg-gray-800 border-gray-600 text-white disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-400" />
                    Address Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Full Address</Label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!editing}
                        placeholder="Enter full address"
                        className="bg-gray-800 border-gray-600 text-white disabled:opacity-60"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-gray-300">City</Label>
                        <Input
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          disabled={!editing}
                          placeholder="Enter city"
                          className="bg-gray-800 border-gray-600 text-white disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">State</Label>
                        <Input
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          disabled={!editing}
                          placeholder="Enter state"
                          className="bg-gray-800 border-gray-600 text-white disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">PIN Code</Label>
                        <Input
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          disabled={!editing}
                          placeholder="Enter PIN code"
                          className="bg-gray-800 border-gray-600 text-white disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                    Payment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">UPI ID</Label>
                      <Input
                        value={formData.upi_id}
                        onChange={(e) => handleInputChange('upi_id', e.target.value)}
                        disabled={!editing}
                        placeholder="your-upi@provider"
                        className="bg-gray-800 border-gray-600 text-white disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">USDT TRC20 Address</Label>
                      <Input
                        value={formData.usdt_address}
                        onChange={(e) => handleInputChange('usdt_address', e.target.value)}
                        disabled={!editing}
                        placeholder="TRC20 wallet address"
                        className="bg-gray-800 border-gray-600 text-white disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {editing && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h5 className="text-blue-400 font-semibold mb-2">💡 Profile Tips</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Complete your profile for better gaming experience</li>
                      <li>• Add payment methods for faster withdrawals</li>
                      <li>• Keep your information updated for KYC verification</li>
                      <li>• Contact support if you need help with verification</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
